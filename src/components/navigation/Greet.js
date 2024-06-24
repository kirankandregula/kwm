import React from "react";

const Greet = ({ userName }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  const toPascalCase = (str) => {
    return str
      .replace(/\s(.)/g, function (match) {
        return match.toUpperCase();
      })
      .replace(/\s/g, "")
      .replace(/^(.)/, function (match) {
        return match.toUpperCase();
      });
  };

  // Ensure userName is not undefined or null
  const displayName = userName ? toPascalCase(userName) : "";

  return <span>{displayName ? `${greeting} ${displayName}` : "Artha Investments"}</span>;
};

export default Greet;
