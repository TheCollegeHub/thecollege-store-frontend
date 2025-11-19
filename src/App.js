import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import women_banner from "./Components/Assets/banner_women.png";
import men_banner from "./Components/Assets/banner_mens.png";
import kid_banner from "./Components/Assets/banner_kids.png";
import LoginSignup from "./Pages/LoginSignup";
import Checkout from './Components/Checkout/Checkout';
import OrderCompleted from './Components/OrderCompleted/OrderCompleted';
import MyOrders from './Components/MyOrders/MyOrders';
import OrderDetails from './Components/OrderDetails/OrderDetails';
import Favorites from './Pages/Favorites';
import FavoritesProvider from './Context/FavoritesContext';
export const backend_url = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:4000';
export const currency = '$';

function App() {

  return (
    <div>
      <Router>
        <FavoritesProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Shop gender="all" />} />
            <Route path="/men" element={<ShopCategory banner={men_banner} category="men" />} />
            <Route path="/women" element={<ShopCategory banner={women_banner} category="women" />} />
            <Route path="/kids" element={<ShopCategory banner={kid_banner} category="kid" />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/order/:_id" element={<OrderDetails />} />
            <Route path='/product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
            </Route>
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<LoginSignup/>} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-completed" element={<OrderCompleted />} />

          </Routes>
          <Footer />
        </FavoritesProvider>
      </Router>
    </div>
  );
}

export default App;
