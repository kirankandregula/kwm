import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useData } from "../DataProvider";

const AppBarComponent = ({ handleLogout }) => {
  const theme = useTheme();
  const isMediumDevice = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [cookies] = useCookies(["userName", "userRole"]);
  const { notifications, resetNotificationCount, sellingRecommendations } = useData();
  const navigate = useNavigate();
  const [badgeContent, setBadgeContent] = useState(0);

  useEffect(() => {
    // Calculate the total count of notifications and selling recommendations
    const totalCount = notifications.length + sellingRecommendations.length;
    // Update the badge content
    setBadgeContent(totalCount);
  }, [notifications, sellingRecommendations]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
    resetNotificationCount();
  };

  const handleNotificationClick = () => {
    handleNotificationsClose();
    navigate("/action");
  };

  const renderNotifications = () => {
    if (sellingRecommendations.length === 0) {
      return <MenuItem>No sell recommendations now</MenuItem>;
    } else {
      return (
        <MenuItem onClick={handleNotificationClick}>
          <Typography variant="body2">
            You have {sellingRecommendations.length} sell recommendation(s) now
          </Typography>
        </MenuItem>
      );
    }
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
          <IconButton
            color="inherit"
            onClick={handleNotificationsOpen}
            aria-controls="notifications-menu"
            aria-haspopup="true"
          >
            <Badge badgeContent={badgeContent} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            id="notifications-menu"
            anchorEl={notificationsAnchorEl}
            keepMounted
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
          >
            {notifications.length === 0 ? (
              <MenuItem>No notifications now</MenuItem>
            ) : (
              notifications.map((notification) => (
                <MenuItem key={notification.id}>
                  {notification.type === "buy"
                    ? "You have one buy recommendation now"
                    : "You have one sell recommendation now"}
                </MenuItem>
              ))
            )}
            {renderNotifications()}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppBarComponent;
