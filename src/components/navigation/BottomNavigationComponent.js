import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InfoIcon from "@mui/icons-material/Info";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RadarIcon from "@mui/icons-material/Radar";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const BottomNavigationComponent = ({ handleLogout }) => {
  const [value, setValue] = useState(0);
  const [cookies] = useCookies(["userName", "userRole"]);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "logout") {
      handleLogout();
    } else {
      navigate(newValue);
    }
  };

  const renderUserRoleActions = (userRole) => {
    if (userRole === "Admin") {
      return [
        <BottomNavigationAction
          key="monitor"
          label="Monitor"
          value="/spying"
          icon={<AdminPanelSettingsIcon />}
        />,
        <BottomNavigationAction
          key="radar"
          label="Radar"
          value="/radar"
          icon={<RadarIcon />}
        />,
        <BottomNavigationAction
          key="action"
          label="Action"
          value="/action"
          icon={<ManageAccountsIcon />}
        />,
      ];
    } else if (userRole === "Viewer") {
      return [
        <BottomNavigationAction
          key="action"
          label="Action"
          value="/action"
          icon={<ManageAccountsIcon />}
        />,
        <BottomNavigationAction
          key="contact"
          label="Contact"
          value="/contact"
          icon={<ContactSupportIcon />}
        />,
        <BottomNavigationAction
          key="about"
          label="About"
          value="/about"
          icon={<InfoIcon />}
        />,
      ];
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
      <BottomNavigationAction
        label="Etf"
        value="/etf"
        icon={<MonetizationOnIcon />}
      />
      {renderUserRoleActions(cookies.userRole)}
      {cookies.userName && cookies.userRole && (
        <BottomNavigationAction
          label="Logout"
          value="logout"
          icon={<LogoutIcon />}
        />
      )}
    </BottomNavigation>
  );
};

export default BottomNavigationComponent;
