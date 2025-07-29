const db = require('../../database/mysql');
const bcryptjs = require('bcryptjs');

const registerUser = async (req, res) => {
  const {firstname,lastname,email,phone,gender,date_of_birth,role,password,location_id,} = req.body;

  try {
    const requiredFields = ['firstname', 'lastname', 'email', 'phone','gender', 'date_of_birth', 'password', 'location_id']

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const allowedGenders = ['male', 'female'];
    const allowedRoles = ['vendor', 'customer'];

    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({ error: 'Gender must be male or female' });
    }
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Role must be vendor or customer' });
    }

    const [[emailExists]] = await db.query('SELECT 1 FROM users WHERE email = ?', [email]);
    if (emailExists) return res.status(409).json({ error: 'Email already exists' });

    const [[phoneExists]] = await db.query('SELECT 1 FROM users WHERE phone = ?', [phone]);
    if (phoneExists) return res.status(409).json({ error: 'Phone number already exists' });

    const [[locationExists]] = await db.query('SELECT 1 FROM locations WHERE location_id = ?', [location_id]);
    if (!locationExists) return res.status(400).json({ error: 'Invalid location_id' });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const [result] = await db.query(`
      INSERT INTO users 
        (firstname, lastname, email, phone, gender, date_of_birth, role, password, location_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstname, lastname, email, phone,
        gender, date_of_birth,
        role, hashedPassword, location_id
      ]
    );

    const user = {
      user_id: result.insertId,
      firstname,
      lastname,
      email,
      phone,
      gender,
      date_of_birth,
      role,
      location_id,
    };

    req.session.user = user;

    req.session.save(err => {
      if (err) return res.status(500).json({ message: 'Session save failed' });
      return res.status(201).json({ message: 'Registration successful', user });
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'Email not found' });

    const user = rows[0];
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const userSession = {
      user_id: user.user_id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      role: user.role,
      location_id: user.location_id,
    };

    req.session.user = userSession;

    req.session.save(err => {
      if (err) return res.status(500).json({ error: 'Session save failed' });
      return res.status(200).json({
        message: 'Login successful',
        user: userSession,
        role: user.role,
      });
    });

  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const logoutUser = (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logout successful' });
  });
}

const loggedUser = (req, res) => {
  if (req.session?.user) {
    return res.status(200).json({
      message: 'Session active',
      loggedIn: true,
      user: req.session.user,
      role: req.session.user.role,
    });
  }

  return res.status(200).json({
    message: 'No active session',
    loggedIn: false,
    user: null,
  });
}

module.exports = {registerUser,loginUser,logoutUser,loggedUser,}
