// NotificationComponent.js
import React from "react";
import { useData } from "./dataprovider/DataProvider"; // Adjust the import path if necessary

const NotificationComponent = () => {
  const { notifications, handleNotificationClick } = useData();

  return (
    <div>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={handleNotificationClick}
          style={{
            cursor: "pointer",
            margin: "10px",
            padding: "10px",
            border: "1px solid black",
          }}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
