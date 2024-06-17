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
  const [cookies] = useCookies(["userName", "userRole","userId"]);
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
    <MenuItem key="home" onClick={handleMenuClose} component={Link} to="/">
      Home
    </MenuItem>,
    <MenuItem key="etf" onClick={handleMenuClose} component={Link} to="/etf">
      Etf-Service
    </MenuItem>,
    <MenuItem
      key="action"
      onClick={handleMenuClose}
      component={Link}
      to="/action"
    >
      Action
    </MenuItem>,
    <MenuItem
      key="about"
      onClick={handleMenuClose}
      component={Link}
      to="/about"
    >
      About
    </MenuItem>,
    <MenuItem
      key="contact"
      onClick={handleMenuClose}
      component={Link}
      to="/contact"
    >
      Contact
    </MenuItem>,
  ];

  if (cookies.userRole === "Admin") {
    menuItems.push(
      <MenuItem
        key="spying"
        onClick={handleMenuClose}
        component={Link}
        to="/spying"
      >
        Stock Monitor
      </MenuItem>,
      <MenuItem
        key="radar"
        onClick={handleMenuClose}
        component={Link}
        to="/radar"
      >
        Stock In Radar
      </MenuItem>
    );
  }

  if (cookies.userRole === "Viewer") {
    menuItems.push(
      <MenuItem
        key="action-viewer"
        onClick={handleMenuClose}
        component={Link}
        to="/action"
      >
        Action
      </MenuItem>
    );
  }

  if (cookies.userName && cookies.userRole) {
    menuItems.push(
      <MenuItem key="logout" onClick={onLogout}>
        Logout
      </MenuItem>
    );
  } else {
    menuItems.push(
      <MenuItem
        key="login"
        onClick={handleMenuClose}
        component={Link}
        to="/login"
      >
        Login
      </MenuItem>
    );
  }

  return (
    <AppBar position="fixed" className="app-bar">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {cookies.userName && cookies.userId ? (
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
                {menuItems}
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              {(cookies.userRole === "Viewer" ||
                cookies.userRole === "Admin") && (
                <Button color="inherit" component={Link} to="/action">
                  Action
                </Button>
              )}
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
              <Button color="inherit" component={Link} to="/etf">
                Etf-Service
              </Button>
              <Button color="inherit" component={Link} to="/about">
                About
              </Button>
              <Button color="inherit" component={Link} to="/contact">
                Contact
              </Button>

              {cookies.userName && cookies.userRole ? (
                <Button color="inherit" onClick={onLogout}>
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
            sx={{ marginLeft: 2 }}
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
