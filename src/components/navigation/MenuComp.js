import React from "react";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useCookies } from "react-cookie";

const MenuComp = ({ anchorEl, handleMenuClose, handleLogout }) => {
  const [cookies] = useCookies(["userName", "userRole"]);

  // Create an array of MenuItem components
  const menuItems = [
    <MenuItem key="home" onClick={handleMenuClose}>
      <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
        Home
      </Link>
    </MenuItem>,
    <MenuItem key="etf" onClick={handleMenuClose}>
      <Link to="/etf" style={{ color: "inherit", textDecoration: "none" }}>
        Etf-Service
      </Link>
    </MenuItem>,
    <MenuItem key="about" onClick={handleMenuClose}>
      <Link to="/about" style={{ color: "inherit", textDecoration: "none" }}>
        About
      </Link>
    </MenuItem>,
    <MenuItem key="contact" onClick={handleMenuClose}>
      <Link to="/contact" style={{ color: "inherit", textDecoration: "none" }}>
        Contact
      </Link>
    </MenuItem>,
  ];

  if (cookies.userRole === "Admin") {
    menuItems.push(
      <MenuItem key="spying" onClick={handleMenuClose}>
        <Link to="/spying" style={{ color: "inherit", textDecoration: "none" }}>
          Stock Monitor
        </Link>
      </MenuItem>
    );
    menuItems.push(
      <MenuItem key="radar" onClick={handleMenuClose}>
        <Link to="/radar" style={{ color: "inherit", textDecoration: "none" }}>
          Stock In Radar
        </Link>
      </MenuItem>
    );
  }

  if (cookies.userRole === "Viewer") {
    menuItems.push(
      <MenuItem key="action" onClick={handleMenuClose}>
        <Link to="/action" style={{ color: "inherit", textDecoration: "none" }}>
          Action
        </Link>
      </MenuItem>
    );
  }

  if (cookies.userName && cookies.userRole) {
    menuItems.push(
      <MenuItem key="logout" onClick={handleLogout}>
        Logout
      </MenuItem>
    );
  } else {
    menuItems.push(
      <MenuItem key="login" onClick={handleMenuClose}>
        <Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>
          Login
        </Link>
      </MenuItem>
    );
  }

  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {menuItems}
    </Menu>
  );
};

export default MenuComp;
