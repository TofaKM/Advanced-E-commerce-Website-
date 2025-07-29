# Advanced-E-commerce-Website-
🛒 Chap E-Commerce Platform
An online e-commerce platform built to enable seamless product exchange between vendors and customers. Designed using a modern full-stack architecture with a focus on user-friendly experience, scalability, and localized transaction support.

📌 Project Overview
Chap E-Commerce is a web-based platform that connects sellers and buyers, allowing for real-time product listing, browsing, ordering, and secure checkout. Originally conceptualized as a university project, this platform serves as a practical model for small-to-medium online retail businesses in Kenya and beyond.

🚀 Features
👥 User Roles
Vendor: Register, list products, manage inventory, track sales.

Customer: Register, browse products, manage cart, place orders.

🧩 Functional Modules
User Authentication (Vendor/Customer)

Product Catalog (Add/Update/Delete)

Cart Management (Increment/Decrement/Delete)

Checkout System

Order and Sales History

Secure Password Handling (bcrypt)

Mpesa API Integration (planned)

WhatsApp Communication API (planned)

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, Bootstrap
Backend	Node.js, Express.js
Database	MySQL
Auth & Security	bcrypt.js, express-session
API Handling	Axios

🧱 Database Schema
Users (Customers & Vendors)

Products & Variants

Categories

Locations

Cart

Orders & Order Items

Purchases

Includes foreign key constraints, ENUMs for roles/statuses, and hashed password storage.

🎯 Key Objectives
✔️ Build a user-friendly, scalable platform

✔️ Provide flexible and secure payment options (e.g., M-Pesa integration)

✔️ Enable direct vendor-customer communication

✔️ Support responsive mobile-first design

✔️ Encourage safe and transparent transactions

📐 System Architecture
Frontend: Handles user interaction via React components and Axios API calls.

Backend: RESTful API endpoints structured via Express routers.

Database: Relational schema with strict data consistency enforcement.

🔍 Example API Endpoints
Authentication
http
Copy
Edit
POST /register         # Register user
POST /login            # Login user
GET /logged            # Check if logged in
POST /logout           # Logout
Product (Vendor)
http
Copy
Edit
POST /vendor           # Add product
PUT /vendor/:id        # Update product
DELETE /vendor/:id     # Delete product
GET /vendor            # View vendor products
Customer Actions
http
Copy
Edit
GET /                 # View all products
GET /:id              # View product details
POST /add             # Add to cart
POST /checkout        # Begin checkout
GET /history          # View past purchases
🧪 Testing & QA
✅ Unit testing on backend services

✅ Integration testing for route/database consistency

✅ UI & Functional testing for user workflows

✅ Security validation on login/auth routes

🌍 Deployment Strategy
Pilot Rollout: Focused in Nairobi and Kiambu for initial feedback

Phased Implementation: Modules released gradually for risk management

Training & Support: Tutorials, video sessions, user engagement strategies

📈 Future Improvements
Mobile app version

M-Pesa integration (completed or pending)

Push notifications

Analytics dashboard

Admin control panel

SEO optimization

👤 Author
Tofa Kimani Mwangi
BSc Applied Computing - KCA University


📄 License
This project is open-source and intended for educational and portfolio use. Commercial reuse should credit the author appropriately
