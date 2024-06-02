import React, { useState } from "react";
import { Link, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import StockMoniter from "./components/StockMoniter";
import About from "./components/About";
import Contact from "./components/Contact";
import LoginPage from "./components/LoginPage";
import "./App.css";
import UserDetails from "./components/UserDetails";
import EtfService from "./components/Etf";
import AdminPage from "./components/AdminPage";
import ViewerPage from "./components/ViewerPage";
import YourPortfolio from "./components/YourPortFolio";
import { useCookies } from "react-cookie";
import HomePage from "./components/HomePage";
import StockInRadar from "./components/StocksInRadar";
import { DataProvider } from "./components/DataProvider";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [cookies, , removeCookie] = useCookies(["userName", "userRole"]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    removeCookie("userName", { path: "/" });
    removeCookie("userRole", { path: "/" });
    return <Navigate to="/login" />;
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top ">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              src="https://i.ibb.co/SsdfRXP/KK-Wealth-Mills-transparent.png"
              alt="KK Wealth Mills Logo"
              style={{ maxWidth: "40px", marginRight: "10px" }}
            />
            KK Wealth Mills
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${
              isOpen ? "show" : ""
            } justify-content-end`}
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={handleClick}>
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/spying" onClick={handleClick}>
                  Stock Moniter
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/radar" onClick={handleClick}>
                  Stock In Radar
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/etf" onClick={handleClick}>
                  Etf-Service
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={handleClick}>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={handleClick}>
                  Contact
                </Link>
              </li>
              {cookies.userName && cookies.userRole ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={handleClick}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <DataProvider>
        <Routes>
          <Route path="/spying" element={<StockMoniter />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/etf" element={<EtfService />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/user-details/:userId" element={<UserDetails />} />
          <Route path="/admin/:userId" element={<AdminPage />} />
          <Route path="/viewer/:userId" element={<ViewerPage />} />
          <Route path="/portfolio/:userId" element={<YourPortfolio />} />
          <Route path="/radar" element={<StockInRadar />} />
        </Routes>
      </DataProvider>
      <footer
        className="footer py-3 bg-dark text-white"
        style={{ position: "fixed", bottom: 0, width: "100%" }}
      >
        <div className="container text-center">
          All rights reserved to KK Wealth Mills @2024
        </div>
      </footer>
    </BrowserRouter>
  );
}
