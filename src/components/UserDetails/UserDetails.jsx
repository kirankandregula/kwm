import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Box,
  Container,
  Grid,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCookies } from "react-cookie";
import UserMetricsCard from "./UserMetricsCard";
import StockTable from "./StockTable";
import "../../css/UserDetails.css";
import { useData } from "../DataProvider";

import DiversificationDiv from "./diversificationdiv";
import BillableDiv from "./BillableDiv";
import CompactStockView from "./CompactStockView ";
import usePullToRefresh from "../usePullToRefresh";
import RefreshButton from "../RefreshButton ";

function UserDetails() {
  const { financialData, stockData, individualStockData, loading, fetchData } =
    useData();
  const [filteredData, setFilteredData] = useState([]);
  const [setLoading] = useState(true);
  const [userFinancialData, setUserFinancialData] = useState(null);
  const [cookies] = useCookies(["userId", "userName", "userRole"]);
  const [totalLatestValue, setTotalLatestValue] = useState(0);
  const [averagePE, setAveragePE] = useState(0);
  const [averageScopeToGrow, setAverageScopeToGrow] = useState(0);
  const [cardsLoading, setCardsLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isMidScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  usePullToRefresh(fetchData, isMidScreen, isLargeScreen);

  useEffect(() => {
    if (!loading) {
      if (financialData && stockData && individualStockData) {
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
        setCardsLoading(false);
      }
    }
  }, [loading, financialData, stockData, individualStockData, userId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className="user-details" sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="center" mb={3}>
        <div className="d-flex justify-content-center mb-3">
          {isLargeScreen && (
            <RefreshButton
              handleClick={() => {
                setLoading(true);
                fetchData();
              }}
            />
          )}
        </div>
      </Box>
      {!userFinancialData && (
        <Box textAlign="center" color="textSecondary" mb={3}>
          It will take a few seconds. Please wait...
        </Box>
      )}
      {filteredData && filteredData.length === 0 && (
        <Box textAlign="center" color="error" mb={3}>
          You don't have any holdings now.
        </Box>
      )}
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          {cardsLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100px"
            >
              <CircularProgress />
            </Box>
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
        </Grid>

        <Grid item xs={12} md={4}>
          {cardsLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <BillableDiv
              averagePE={averagePE}
              averageScopeToGrow={averageScopeToGrow}
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
        </Grid>
        <Grid item xs={12} md={4} style={{ marginBottom: "2px" }}>
          {cardsLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <DiversificationDiv
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
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {cardsLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100px"
            >
              <CircularProgress />
            </Box>
          ) : isLargeScreen ? (
            <StockTable filteredData={filteredData} />
          ) : (
            <CompactStockView
              filteredData={filteredData}
              individualStockData={individualStockData}
            />
          )}
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ mb: 8, mt: "1px" }}>
        <Grid item xs={12} textAlign="center">
          {(isLargeScreen || isMidScreen) && cookies.userRole === "Admin" && (
            <Button variant="contained" color="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );

  function handleBack() {
    if (cookies.userRole === "Admin" && isLargeScreen) {
      navigate(`/portfolio/${cookies.userId}`);
    } else {
      navigate("/");
    }
  }
}

export default UserDetails;
