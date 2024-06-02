import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import UserMetricsCard from "./UserMetricsCard";
import BillDetailsCard from "./BillDetailsCard";
import StockTable from "./StockTable";
import "../css/UserDetails.css";
import { useData } from "./DataProvider";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function UserDetails() {
  const { financialData, stockData, individualStockData, loading } = useData(); // Use the correct variable from the DataContext

  const [filteredData, setFilteredData] = useState([]);
  const [userFinancialData, setUserFinancialData] = useState(null);
  const [cookies] = useCookies(["userId", "userName", "userRole"]);
  const [totalLatestValue, setTotalLatestValue] = useState(0);
  const [averagePE, setAveragePE] = useState(0);
  const [averageScopeToGrow, setAverageScopeToGrow] = useState(0);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [quarterlyReturn, setQuarterlyReturn] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!loading && financialData && stockData && individualStockData) {
        const userData = financialData.find(
          (user) => user.user_id === parseInt(userId)
        );
        const filteredUserData = stockData.filter(
          (stock) => stock.user_id === parseInt(userId)
        );

        const formattedData = filteredUserData.map((stock) => ({
          stockId: stock.stock_id,
          quantity: stock.quantity,
        }));

        setFilteredData(formattedData);
        let total = 0;
        let weightedPETotal = 0;
        let weightedScopeTotal = 0;

        formattedData.forEach((stock) => {
          const fetchedStockData = individualStockData.find(
            (item) => item.stock_id === stock.stockId
          );
          const latestValue = fetchedStockData.LTP * stock.quantity;
          total += latestValue;
          weightedPETotal += fetchedStockData.pe * latestValue;
          weightedScopeTotal +=
            parseInt(fetchedStockData.scopeToGrow.replace("%", "")) *
            latestValue;
        });
        setTotalLatestValue(total.toFixed(2));
        setAveragePE((weightedPETotal / total).toFixed(2));
        setAverageScopeToGrow((weightedScopeTotal / total).toFixed(2));
        setUserFinancialData(userData);

        const preValue = parseFloat(userData ? userData.Previous_Value : 0);
        const presentValue =
          parseFloat(total) +
          (userData ? parseFloat(userData.Gold) : 0) +
          (userData ? parseFloat(userData.Debt) : 0);
        const quarterlyReturn = (
          ((presentValue - preValue) / preValue) *
          100
        ).toFixed(2);
        setQuarterlyReturn(quarterlyReturn);

        setCardsLoading(false);
      }
    }
  }, [loading, financialData, stockData, individualStockData, userId]);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }

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

  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader
          color={"#36D7B7"}
          loading={loading}
          css={override}
          size={150}
        />
      </div>
    );
  }

  return (
    <div className="container-fluid user-details">
      <h3 className="text-center text-secondary" style={{ marginTop: "60px" }}>
        {userFinancialData
          ? `${getGreeting()}.... ${toPascalCase(userFinancialData.Name)}`
          : "Loading Portfolio Details....."}
      </h3>
      {!userFinancialData && (
        <p className="text-center text-secondary">
          It will take a few seconds. Please wait...
        </p>
      )}
      {filteredData && filteredData.length === 0 && (
        <p className="text-center text-danger">
          You don't have any holdings now.
        </p>
      )}
      <div className="row mt-4">
        <div className="col-lg-6 col-md-12 mb-4">
          {cardsLoading ? (
            <div className="spinner-container">
              <ClipLoader
                color={"#36D7B7"}
                loading={cardsLoading}
                css={override}
                size={150}
              />
            </div>
          ) : (
            <UserMetricsCard
              averagePE={averagePE}
              averageScopeToGrow={averageScopeToGrow}
              preValue={
                userFinancialData ? userFinancialData.Previous_Value : 0
              }
              equity={totalLatestValue}
              gold={userFinancialData ? userFinancialData.Gold : 0}
              debt={userFinancialData ? userFinancialData.Debt : 0}
              totalLatestValue={
                parseFloat(totalLatestValue) +
                (userFinancialData ? parseFloat(userFinancialData.Gold) : 0) +
                (userFinancialData ? parseFloat(userFinancialData.Debt) : 0)
              }
            />
          )}
        </div>
        <div className="col-lg-6 col-md-12 mb-4">
          {cardsLoading ? (
            <div className="spinner-container">
              <ClipLoader
                color={"#36D7B7"}
                loading={cardsLoading}
                css={override}
                size={150}
              />
            </div>
          ) : quarterlyReturn < 5 ? (
            <div className="alert alert-warning" role="alert">
              Billing is applicable for quarterly returns above 5%. Since your
              portfolio's quarterly return is below this threshold, billing is
              not applicable at this time.
            </div>
          ) : (
            <BillDetailsCard
              preValue={
                userFinancialData ? userFinancialData.Previous_Value : 0
              }
              presentValue={
                parseFloat(totalLatestValue) +
                (userFinancialData ? parseFloat(userFinancialData.Gold) : 0) +
                (userFinancialData ? parseFloat(userFinancialData.Debt) : 0)
              }
            />
          )}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <h4 className="text-center mb-4">Stock Holdings</h4>
          {loading ? (
            <div className="spinner-container">
              <ClipLoader
                color={"#36D7B7"}
                loading={loading}
                css={override}
                size={150}
              />
            </div>
          ) : (
            <StockTable filteredData={filteredData} />
          )}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 text-center mb-5">
          {cookies.userRole === "Admin" && (
            <button className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );

  function handleBack() {
    if (cookies.userRole === "Admin") {
      navigate(`/portfolio/${cookies.userId}`);
    } else {
      navigate("/");
    }
  }
}

export default UserDetails;
