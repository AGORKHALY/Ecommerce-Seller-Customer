import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SellerDashboard from './components/SellerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Register from './components/Register';
import Login from './components/Login';
import CustomerCart from './components/CustomerCart';
import OrderHistory from './components/OrderHistory';
import PrivateRoute from './components/PrivateRoute';  // Protecting dashboard routes
import PublicRoute from './components/PublicRoute';  // Protecting login and register routes

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes that need to be protected from authenticated users */}
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />

        {/* Protected Routes using PrivateRoute */}
        <Route path="/dashboard/seller/:sellerId" element={<PrivateRoute element={<SellerDashboard />} />} />
        <Route path="/dashboard/customer" element={<PrivateRoute element={<CustomerDashboard />} />} />
        <Route path="/customer/cart" element={<PrivateRoute element={<CustomerCart />} />} />
        <Route path="/customer/order-history" element={<PrivateRoute element={<OrderHistory />} />} />
      </Routes>
    </Router>
  );
}

export default App;
