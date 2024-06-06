// src/components/navigation/Greet.js
import React from 'react';

const Greet = ({ userName }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  function toPascalCase(str) {
    return str
      .replace(/\s(.)/g, function (match) {
        return match.toUpperCase();
      })
      .replace(/\s/g, "")
      .replace(/^(.)/, function (match) {
        return match.toUpperCase();
      });
  }

  return <span>{userName ? `${greeting} ${toPascalCase(userName)}` : "Wealth Wave"}</span>;
};

export default Greet;
