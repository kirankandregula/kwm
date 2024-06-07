import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InfoIcon from "@mui/icons-material/Info";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"; // For Moniter
import RadarIcon from "@mui/icons-material/Radar"; // For Radar
import { Link, useNavigate } from "react-router-dom";
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

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
      <BottomNavigationAction label="Etf" value="/etf" icon={<MonetizationOnIcon />} />
      {cookies.userRole === "Admin" ? (
        [
          <BottomNavigationAction key="moniter" label="Moniter" value="/spying" icon={<AdminPanelSettingsIcon />} />,
          <BottomNavigationAction key="radar" label="Radar" value="/radar" icon={<RadarIcon />} />
        ]
      ) : (
        [
          <BottomNavigationAction key="about" label="About" value="/about" icon={<InfoIcon />} />,
          <BottomNavigationAction key="contact" label="Contact" value="/contact" icon={<ContactSupportIcon />} />
        ]
      )}
      {cookies.userName && cookies.userRole && (
        <BottomNavigationAction label="Logout" value="logout" icon={<LogoutIcon />} />
      )}
    </BottomNavigation>
  );
};

export default BottomNavigationComponent;
