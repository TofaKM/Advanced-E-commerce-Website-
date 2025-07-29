
const checkRole = (roles) => {
  return (req, res, next) => {
    console.log('checkRole - Session:', req.session);
    if (!req.session.user) {
      console.log('checkRole - No user in session');
      return res.status(401).json({ success: false, error: 'Unauthorized: Please log in' });
    }
    if (!roles.includes(req.session.user.role)) {
      console.log(`checkRole - Unauthorized role: ${req.session.user.role}, required: ${roles}`);
      return res.status(403).json({ success: false, error: `Unauthorized: ${roles.join(' or ')} access required` });
    }
    console.log(`checkRole - Authorized user: ${req.session.user.user_id}, role: ${req.session.user.role}`);
    next();
  };
};

module.exports =  checkRole 