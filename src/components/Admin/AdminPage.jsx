import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useData } from "../dataprovider/DataProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useMediaQuery } from "@mui/material";
import AdminTable from "./AdminTable";
import CompactUserView from "./CompactUserView";
import RefreshButton from "../RefreshButton";
import usePullToRefresh from "../usePullToRefresh";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function AdminPage() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["userName"]);
  const navigate = useNavigate();
  const { financialData, stockData, individualStockData, fetchData } =
    useData();
  const isLargeScreen = useMediaQuery("(min-width:1200px)");

  useEffect(() => {
    if (!cookies.userName) {
      navigate("/login");
      return;
    }

    if (financialData && stockData && individualStockData) {
      const updatedUserData = financialData.map((user) => {
        const userStocks = stockData.filter(
          (stock) => stock.user_id === user.user_id
        );
        let total = 0;
        let weightedPETotal = 0;
        let weightedScopeTotal = 0;
        userStocks.forEach((stock) => {
          const stockInfo = individualStockData.find(
            (item) => item.stock_id === stock.stock_id
          );
          if (stockInfo) {
            const latestValue = stock.quantity * stockInfo.LTP;
            total += latestValue;
            weightedPETotal += stockInfo.pe * latestValue;
            weightedScopeTotal +=
              parseInt(stockInfo.scopeToGrow.replace("%", "")) * latestValue;
          }
        });
        const preValue = parseFloat(user.Previous_Value || 0);
        const presentValue =
          total + parseFloat(user.Gold || 0) + parseFloat(user.Debt || 0);
        const quarterlyReturn = preValue
          ? (((presentValue - preValue) / preValue) * 100).toFixed(2)
          : 0;
        const billableReturn = ((presentValue - (preValue*1.05)).toFixed(2));
        const billableAmount = Math.max((billableReturn * 0.2).toFixed(2), 0);
        return {
          ...user,
          presentValue: presentValue.toFixed(2),
          quarterlyReturn,
          billableAmount,
          averagePE: (weightedPETotal / total).toFixed(2),
          averageScopeToGrow: (weightedScopeTotal / total).toFixed(2),
        };
      });
      setUserData(updatedUserData);
      setLoading(false);
    }
  }, [
    financialData,
    stockData,
    individualStockData,
    cookies.userName,
    navigate,
  ]);

  const handleRowClick = (userId) => {
    navigate(`/user-details/${userId}`);
  };

  const refreshData = () => {
    setLoading(true);
    fetchData().then(() => setLoading(false)); // Ensure loading state is handled correctly
  };

  usePullToRefresh(refreshData);

  return (
    <div className="container" style={{ overflowY: "auto", height: "100vh" }}>
      <div className="d-flex justify-content-center">
        {isLargeScreen && <RefreshButton handleClick={refreshData} />}
      </div>
      <div
        className="d-flex justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        {loading ? (
          <div className="sweet-loading align-items-center">
            <ClipLoader
              color={"#36D7B7"}
              loading={loading}
              css={override}
              size={150}
            />
          </div>
        ) : (
          <>
            {isLargeScreen ? (
              <AdminTable userData={userData} handleRowClick={handleRowClick} />
            ) : (
              <CompactUserView
                userData={userData}
                handleRowClick={handleRowClick}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
