import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SellerDashboard from './components/SellerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/seller" element={<SellerDashboard />} />
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
