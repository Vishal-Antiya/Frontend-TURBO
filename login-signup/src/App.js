import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import HomePage from './Components/HomePage/HomePage';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import ManageAccount from './Components/ManageAccount/ManageAccount';
import AboutUs from './Components/AboutUs/AboutUs';
import Products from '../Products/Products'; // Uncomment if you have a Products component

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
      </Routes>
    </Router>
  );
}

export default App;
