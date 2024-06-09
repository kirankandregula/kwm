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
                {cookies.userRole === "Admin" && (
                  <>
                    <MenuItem
                      onClick={handleMenuClose}
                      component={Link}
                      to="/spying"
                    >
                      Stock Monitor
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      component={Link}
                      to="/radar"
                    >
                      Stock In Radar
                    </MenuItem>
                  </>
                )}
                {cookies.userRole === "Viewer" && (
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    to="/action"
                  >
                    Action
                  </MenuItem>
                )}
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
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/etf">
                Etf-Service
              </Button>
              <Button color="inherit" component={Link} to="/about">
                About
              </Button>
              <Button color="inherit" component={Link} to="/contact">
                Contact
              </Button>
              {cookies.userRole === "Admin" && (
                <>
                  <Button color="inherit" component={Link} to="/spying">
                    Stock Monitor
                  </Button>
                  <Button color="inherit" component={Link} to="/radar">
                    Stock In Radar
                  </Button>
                </>
              )}
              {cookies.userRole === "Viewer" && (
                <Button color="inherit" component={Link} to="/action">
                  Action
                </Button>
              )}
              {cookies.userName && cookies.userRole ? (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppBarComponent;
