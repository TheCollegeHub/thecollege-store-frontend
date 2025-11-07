import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, IconButton, Typography, Badge } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from '../Assets/logothecollegestore.png';
import { ShopContext } from '../../Context/ShopContext';
import { FavoritesContext } from '../../Context/FavoritesContext';
import nav_dropdown from '../Assets/nav_dropdown.png';
import { backend_url } from '../../App';
import './Navbar.css';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const { favorites } = useContext(FavoritesContext);
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
        <li data-qa-locator={"shop-nav"} onClick={() => { setMenu("shop") }}><Link to='/' style={{ textDecoration: 'none' }}>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
        <li data-qa-locator={"men-nav"} onClick={() => { setMenu("men") }}><Link to='/men' style={{ textDecoration: 'none' }}>Men</Link>{menu === "men" ? <hr /> : <></>}</li>
        <li data-qa-locator={"women-nav"} onClick={() => { setMenu("women") }}><Link to='/women' style={{ textDecoration: 'none' }}>Women</Link>{menu === "women" ? <hr /> : <></>}</li>
        <li data-qa-locator={"kids-nav"} onClick={() => { setMenu("kids") }}><Link to='/kids' style={{ textDecoration: 'none' }}>Kids</Link>{menu === "kids" ? <hr /> : <></>}</li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') && userName
          ? <>
              <Typography variant="body1" className="welcome-text">Olá, {userName}!</Typography>
              <div className="nav-action-icons">
                <IconButton 
                  className="nav-icon-button settings-btn"
                  onClick={handleMenuOpen}
                  aria-label="Settings"
                >
                  <SettingsIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 180,
                    }
                  }}
                >
                  <MenuItem onClick={() => { setMenu("myorders"); handleMenuClose(); }}>
                    <Link to='/myorders' style={{ textDecoration: 'none', color: 'inherit' }}>My Orders</Link>
                  </MenuItem>
                  <MenuItem onClick={() => { localStorage.removeItem('auth-token'); localStorage.removeItem('user-id'); window.location.replace("/"); }}>
                    Logout
                  </MenuItem>
                </Menu>
                <Link to="/favorites" className="nav-icon-button favorites-btn" onClick={() => setMenu("favorites")}>
                  <Badge badgeContent={favorites.length} color="error">
                    <FavoriteIcon />
                  </Badge>
                </Link>
                <Link data-qa-locator={"cart-button"} to="/cart" className="nav-icon-button cart-btn" onClick={() => setMenu("cart")}>
                  <Badge badgeContent={getTotalCartItems()} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </Link>
              </div>
            </>
          : <Link to='/login' style={{ textDecoration: 'none' }}><button data-qa-label="button-login">Login</button></Link>}
      </div>
    </div>
  );
};

export default Navbar;
