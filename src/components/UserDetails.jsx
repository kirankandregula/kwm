import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCookies } from "react-cookie";
import UserMetricsCard from "./UserMetricsCard";
import BillDetailsCard from "./BillDetailsCard";
import StockTable from "./StockTable";
import "../css/UserDetails.css";
import { useData } from "./DataProvider";
import { FaSync } from "react-icons/fa";
import CompactStockView from "./CompactStockView ";

function UserDetails() {
  const { financialData, stockData, individualStockData, loading, fetchData } =
    useData();
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
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  console.log(cookies.userRole);
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
    <Container className="user-details" sx={{ mt: 10 }}>
      <Typography
        variant="h4"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        {userFinancialData
          ? `${getGreeting()}.... ${toPascalCase(userFinancialData.Name)}`
          : "Loading Portfolio Details....."}
      </Typography>
      <Box display="flex" justifyContent="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaSync />}
          onClick={() => {
            setCardsLoading(true);
            fetchData();
          }}
        >
          Refresh Data
        </Button>
      </Box>
      {!userFinancialData && (
        <Typography align="center" color="textSecondary" gutterBottom>
          It will take a few seconds. Please wait...
        </Typography>
      )}
      {filteredData && filteredData.length === 0 && (
        <Typography align="center" color="error" gutterBottom>
          You don't have any holdings now.
        </Typography>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {cardsLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="80vh"
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
        <Grid item xs={12} md={6}>
          {cardsLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="80vh"
            >
              <CircularProgress />
            </Box>
          ) : quarterlyReturn < 5 ? (
            <Alert severity="warning">
              Billing is applicable for quarterly returns above 5%. Since your
              portfolio's quarterly return is below this threshold, billing is
              not applicable at this time.
            </Alert>
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
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Stock Holdings
          </Typography>
          {cardsLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="80vh"
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
      <Grid container spacing={4} sx={{ mb: 10 }}>
        <Grid item xs={12} textAlign="center">
      
          {cookies.userRole === "Admin" && (
            <Button variant="contained" color="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
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
