import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import HomePage from './Components/HomePage/HomePage';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import ManageAccount from './Components/ManageAccount/ManageAccount';
import AboutUs from './Components/AboutUs/AboutUs';
import Products from './Components/Products/Products';
import AdminPage from './Components/AdminPage/AdminPage';
import Cart from './Components/Cart/Cart';
import MyOrders from './Components/MyOrders/MyOrders';
import OrderConfirmation from './Components/OrderConfirmation/OrderConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<LoginSignup/>}/>
        <Route path = "/home" element = {<HomePage/>}/>
        <Route path="/profile" element={<ProfilePage />}/>
        <Route path="/manage-account" element={<ManageAccount />}/>
        <Route path="/about-us" element={<AboutUs />}/>
        <Route path="/products" element={<Products />}/>
        <Route path="/admin-page" element={<AdminPage />}/>
        <Route path="/cart" element={<Cart />}/>
        <Route path="/orders" element={<MyOrders />}/>
        <Route path="/order-confirmation" element={<OrderConfirmation />}/>
      </Routes>
    </Router>
  );
}

export default App;
