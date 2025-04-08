import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/supplier/login';
import LoginAdmin from './pages/admin/login';
import Register from './pages/supplier/register';
import OrdersWithAction from './pages/supplier/ActOrder';
import OrdersList from './pages/admin/AllOrders';
import ProductList from './pages/admin/ProductList';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<LoginAdmin />} /> {/* נתיב ללוגין של המנהל */}
        <Route path="/admin/OrdersList" element={<OrdersList />} /> {/* נתיב ללוגין של המנהל */}
        <Route path="/admin/ProductList" element={<ProductList />} /> {/* נתיב ללוגין של המנהל */}
        <Route path="/OrdersWithAction" element={<OrdersWithAction />} /> {/* נתיב ללוגין של המנהל */}
      </Routes>
    </Router>
  );
}

export default App;
