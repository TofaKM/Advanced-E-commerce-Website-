import './App.css';
import ProtectedRoutes from './utility/Protected';
import Layout from './component/Layout/Layout';
import Login from './pages/home/Login';
import Home from './pages/home/Home';
import About from './pages/home/About';
import Contact from './pages/home/Contact';
import Register from './pages/home/register';
import CustomerPage from './pages/customer/CustomerPage';
//import CustomerDetails from './pages/customer/CustomerDetails';

import VendorPage from './pages/vendor/VendorPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Customer Routes */}
        <Route path="/customer"element={<ProtectedRoutes element={<CustomerPage />} requiredRole="customer" />}/>
        
        {/* Vendor Routes */}
        <Route path="/vendor"element={<ProtectedRoutes element={<VendorPage />} requiredRole="vendor" />} />

      </Routes>
    </Layout>
  );
}

export default App;