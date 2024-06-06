// src/components/navigation/AppBarComponent.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCookies } from "react-cookie";
import Greet from "./Greet";

const AppBarComponent = ({ handleLogout }) => {
  const theme = useTheme();
  const isMediumDevice = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [cookies] = useCookies(["userName", "userRole"]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className="app-bar">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {cookies.userName ? (
              <Greet userName={cookies.userName} />
            ) : (
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                Wealth Wave
              </Link>
            )}
          </Typography>
          {isMediumDevice ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/">
                  Home
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/etf">
                  Etf-Service
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/about"
                >
                  About
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/contact"
                >
                  Contact
                </MenuItem>
                {cookies.userRole === "Admin"
                  ? [
                      <MenuItem
                        key="moniter"
                        onClick={handleMenuClose}
                        component={Link}
                        to="/spying"
                      >
                        Stock Moniter
                      </MenuItem>,
                      <MenuItem
                        key="radar"
                        onClick={handleMenuClose}
                        component={Link}
                        to="/radar"
                      >
                        Stock In Radar
                      </MenuItem>,
                    ]
                  : null}
                {cookies.userName && cookies.userRole ? (
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                ) : (
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    to="/login"
                  >
                    Login
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              <MenuItem onClick={handleMenuClose} component={Link} to="/">
                Home
                {cookies.userRole === "Admin" && (
                  <>
                    <Button color="inherit" component={Link} to="/spying">
                      Stock Moniter
                    </Button>
                    <Button color="inherit" component={Link} to="/radar">
                      Stock In Radar
                    </Button>
                  </>
                )}
              </MenuItem>
              <Button color="inherit" component={Link} to="/about">
                About
              </Button>
              <Button color="inherit" component={Link} to="/contact">
                Contact
              </Button>
              {cookies.userName && cookies.userRole ? (
                <MenuItem key="logout" onClick={handleLogout}>
                  Logout
                </MenuItem>
              ) : (
                <MenuItem key="login" onClick={handleMenuClose}>
                  <Link
                    to="/login"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Login
                  </Link>
                </MenuItem>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppBarComponent;
