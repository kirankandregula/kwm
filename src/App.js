import React from "react";
import { Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import AppBarComponent from "./components/navigation/AppBarComponent";
import BottomNavigationComponent from "./components/navigation/BottomNavigationComponent";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import StockMonitor from "./components/stockmoniter/StockMoniter";
import About from "./components/About";
import Contact from "./components/Contact";
import LoginPage from "./components/LoginPage";
import "./App.css";
import UserDetails from "./components/UserDetails/UserDetails";
import AdminPage from "./components/Admin/AdminPage";
import ViewerPage from "./components/ViewerPage";
import YourPortfolio from "./components/YourPortFolio";
import { useData } from "./components/dataprovider/DataProvider";
import EtfService from "./components/Etf/EtfService";
import StockInRadar from "./components/stockradar/StockInRadar";
import ActionComponent from "./components/Action/ActionComponent";
import NotificationComponent from "./components/NotificationComponent"; // Import NotificationComponent
import RegisterPage from "./components/RegisterPage";

const App = () => {
  const [cookies] = useCookies(["userName", "userRole", "userId"]);
  const { handleLogout } = useData();

  return (
    <>
      <AppBarComponent onLogout={handleLogout} />
      <NotificationComponent /> {/* Add NotificationComponent here */}
      <Routes>
        <Route path="/" element={<YourPortfolio />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/user-details/:userId"
          element={
            <ProtectedRoute isAllowed={!!cookies.userRole}>
              <UserDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/etf"
          element={
            <ProtectedRoute
              isAllowed={cookies.userRole && cookies.userId && cookies.userRole}
            >
              <EtfService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/:id"
          element={
            <ProtectedRoute isAllowed={cookies.userRole === "Admin"}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewer/:id"
          element={
            <ProtectedRoute isAllowed={cookies.userRole === "Viewer"}>
              <ViewerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio/:id"
          element={
            <ProtectedRoute isAllowed={cookies.userRole}>
              <YourPortfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spying"
          element={
            <ProtectedRoute isAllowed={cookies.userRole === "Admin"}>
              <StockMonitor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/radar"
          element={
            <ProtectedRoute isAllowed={cookies.userRole === "Admin"}>
              <StockInRadar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/action"
          element={
            <ProtectedRoute isAllowed={!!cookies.userRole}>
              <ActionComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
      <BottomNavigationComponent handleLogout={handleLogout} />
    </>
  );
};

export default App;
