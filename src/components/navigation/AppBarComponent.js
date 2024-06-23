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
import { useData } from "../dataprovider/DataProvider";

const AppBarComponent = ({ onLogout }) => {
  const theme = useTheme();
  const isMediumDevice = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [cookies, removeCookie] = useCookies([
    "userName",
    "userRole",
    "userId",
  ]);
  const { notifications, sellingRecommendations, buyRecommendations } =
    useData();
  const navigate = useNavigate();
  const [badgeContent, setBadgeContent] = useState(0);

  useEffect(() => {
    const totalCount =
      notifications.length +
      sellingRecommendations.length +
      buyRecommendations.length;
    setBadgeContent(totalCount);
  }, [
    notifications.length,
    sellingRecommendations.length,
    buyRecommendations.length,
  ]);

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
    setBadgeContent(0);
  };

  const handleNotificationClick = () => {
    handleNotificationsClose();
    navigate("/action");
  };

  const renderNotifications = () => {
    const notificationsArray = [];

    if (sellingRecommendations.length > 0) {
      notificationsArray.push(
        <MenuItem key="sell-recommendations" onClick={handleNotificationClick}>
          <div
            style={{
              backgroundColor: "#ffcccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <Typography variant="body2" style={{ color: "#cc0000" }}>
              You have {sellingRecommendations.length} sell recommendation(s)
              now
            </Typography>
          </div>
        </MenuItem>
      );
    }

    if (buyRecommendations.length > 0) {
      notificationsArray.push(
        <MenuItem key="buy-recommendations" onClick={handleNotificationClick}>
          <div
            style={{
              backgroundColor: "#ccffcc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <Typography variant="body2" style={{ color: "#006600" }}>
              You have {buyRecommendations.length} buy recommendation(s) now
            </Typography>
          </div>
        </MenuItem>
      );
    }

    return notificationsArray;
  };

  const menuItems = [
    { text: "About", link: "/about" },
    { text: "Contact", link: "/contact" },
  ];

  if (cookies.userRole === "Admin") {
    menuItems.push(
      { text: "Etf Service", link: "/etf" },
      { text: "History", link: "/history" }
    );
  }

  if (cookies.userRole === "Viewer") {
    menuItems.push({ text: "Etf Service", link: "/etf" });
  }

  if (cookies.userName && cookies.userRole) {
    menuItems.push({
      text: "Logout",
      value: "logout", // Add a value to identify logout item
    });
  } else {
    menuItems.push({
      text: "Login",
      link: "/login",
    });
  }

  const handleChange = (event, newValue) => {
    if (newValue === "logout") {
      handleLogout(); // Call handleLogout function
    } else {
      navigate(newValue);
    }
    handleMenuClose(); // Close menu after selecting an option
  };

  const handleLogout = () => {
    onLogout(); // Call onLogout function passed from props
    removeCookie("userName"); // Remove userName cookie
    removeCookie("userRole"); // Remove userRole cookie
    removeCookie("userId"); // Remove userId cookie
    navigate("/"); // Navigate to home page
  };

  return (
    <AppBar position="fixed" className="app-bar">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {cookies.userName && cookies.userId && cookies.userRole ? (
              <Greet userName={cookies.userName} />
            ) : (
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                Artha Investments
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
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={(event) =>
                      handleChange(event, item.value || item.link)
                    }
                  >
                    {item.text}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  color="inherit"
                  onClick={() => {
                    if (item.value === "logout") {
                      handleLogout();
                    } else {
                      navigate(item.link);
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </>
          )}

          {cookies.userId &&
            (buyRecommendations.length > 0 ||
              sellingRecommendations.length > 0) && (
              <IconButton
                color="inherit"
                onClick={handleNotificationsOpen}
                aria-controls="notifications-menu"
                aria-haspopup="true"
                sx={{ marginLeft: 2 }}
              >
                <Badge badgeContent={badgeContent} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}

          <Menu
            id="notifications-menu"
            anchorEl={notificationsAnchorEl}
            keepMounted
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
          >
            {notifications.length === 0 &&
            sellingRecommendations.length === 0 &&
            buyRecommendations.length === 0 ? (
              <MenuItem>No notifications now</MenuItem>
            ) : (
              [
                ...notifications.map((notification) => (
                  <MenuItem key={notification.id}>
                    {notification.type === "buy"
                      ? "You have one buy recommendation now"
                      : "You have one sell recommendation now"}
                  </MenuItem>
                )),
                ...renderNotifications(),
              ]
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppBarComponent;
