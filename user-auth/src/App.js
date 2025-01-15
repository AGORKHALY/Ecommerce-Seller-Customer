import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SellerDashboard from './components/SellerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Register from './components/Register';
import Login from './components/Login';
import CustomerCart from './components/CustomerCart';
import OrderHistory from './components/OrderHistory'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/seller/:sellerId" element={<SellerDashboard />} />
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/customer/cart" element={<CustomerCart />} />
        <Route path="/customer/order-history" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
