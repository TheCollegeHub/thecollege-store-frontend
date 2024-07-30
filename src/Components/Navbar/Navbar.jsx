import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, IconButton, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import logo from '../Assets/logothecollegestore.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';
import { backend_url } from '../../App';
import './Navbar.css';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const [userName, setUserName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const userId = localStorage.getItem('user-id');

  const menuRef = useRef();

  const fetchUserInfo = async () => {
    try {
      if (userId) {
        const response = await fetch(`${backend_url}/api/user/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.data.name);
        } else {
          throw new Error('Error to get User Information');
        }
      } else {
        console.info('User Id not found, getting this value:', userId);
      }
    } catch (error) {
      console.error('Error to get User Information:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  });

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='nav'>
      <Link to='/' onClick={() => { setMenu("shop") }} style={{ textDecoration: 'none' }} className="nav-logo">
        <img src={logo} alt="logo" />
        <Typography variant="h6">THE COLLEGE STORE</Typography>
      </Link>
      <img onClick={dropdown_toggle} className='nav-dropdown' src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li data-qa-locator={"shop-nav"} Click={() => { setMenu("shop") }}><Link to='/' style={{ textDecoration: 'none' }}>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
        <li data-qa-locator={"men-nav"} onClick={() => { setMenu("men") }}><Link to='/men' style={{ textDecoration: 'none' }}>Men</Link>{menu === "men" ? <hr /> : <></>}</li>
        <li data-qa-locator={"women-nav"} onClick={() => { setMenu("women") }}><Link to='/women' style={{ textDecoration: 'none' }}>Women</Link>{menu === "women" ? <hr /> : <></>}</li>
        <li data-qa-locator={"kids-nav"} onClick={() => { setMenu("kids") }}><Link to='/kids' style={{ textDecoration: 'none' }}>Kids</Link>{menu === "kids" ? <hr /> : <></>}</li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') && userName
          ? <>
              <Typography variant="body1">Olá, {userName}!</Typography>
              <IconButton 
                onClick={handleMenuOpen}
                aria-label="Menu"
                edge="end"
                style={{ width: 36, height: 36, padding: 8, borderRadius: '50%' }}
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { setMenu("myorders"); handleMenuClose(); }}>
                  <Link to='/myorders' style={{ textDecoration: 'none', color: 'inherit' }}>My Orders</Link>
                </MenuItem>
                <MenuItem onClick={() => { localStorage.removeItem('auth-token'); localStorage.removeItem('user-id'); window.location.replace("/"); }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          : <Link to='/login' style={{ textDecoration: 'none' }}><button data-qa-label="button-login">Login</button></Link>}
        <Link data-qa-locator={"cart-button"} to="/cart"><img src={cart_icon} alt="cart" /></Link>
        <div id='cart-items' className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
