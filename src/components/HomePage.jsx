import React from "react";
import LoginPage from "./LoginPage";
import EtfService from "./Etf";


const HomePage = () => {
  return (
    <div>
      <LoginPage/>
      <EtfService/>
    </div>
  );
};

export default HomePage;
