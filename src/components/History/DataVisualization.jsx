import React, { useMemo, useState } from "react";
import { useData } from "../dataprovider/DataProvider"; // Adjust the path based on your project structure
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "chart.js/auto";
import {
  Legend,
  Chart as ChartJS,
  Tooltip,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import QuarterlyReturnChart from "./QuarterlyReturnChart";
import AnnualReturnChart from "./AnnualReturnChart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

// Register plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const getQuarterLabel = (quarter) => {
  const year = (quarter % 10000) % 100;
  const month = Math.floor(quarter / 10000);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[month]} ${year}`;
};

const getYearLabel = (quarter) => {
  return `${quarter % 10000}`;
};

const calculateCAGR = (initialValue, finalValue, years) => {
  return ((Math.pow(finalValue / initialValue, 1 / years) - 1) * 100).toFixed(
    2
  );
};

const calculateAbsoluteReturn = (initialValue, finalValue) => {
  return (((finalValue - initialValue) / initialValue) * 100).toFixed(2);
};

const DataVisualization = () => {
  const { userHistoryData, userPortfolioPresentValue } = useData();
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const quarterlyData = useMemo(() => {
    const data = userHistoryData.slice(-5).map((entry) => ({
      label: getQuarterLabel(entry.quarter),
      value: entry.closingValue,
      deposit: entry.deposit,
      withdraw: entry.withdraw,
    }));
    data.push({
      label: "Present",
      value: Math.round(userPortfolioPresentValue),
      deposit: 0,
      withdraw: 0,
    });
    return data;
  }, [userHistoryData, userPortfolioPresentValue]);

  const annualData = useMemo(() => {
    const annualMap = {};
    userHistoryData.forEach((entry) => {
      const year = getYearLabel(entry.quarter);
      const month = Math.floor(entry.quarter / 10000);
      if (month === 3) {
        // March
        annualMap[year] = {
          value: entry.closingValue,
          deposit: entry.deposit,
          withdraw: entry.withdraw,
        };
      }
    });
    const data = Object.keys(annualMap)
      .slice(-4)
      .map((year) => ({
        label: year,
        value: annualMap[year].value,
        deposit: annualMap[year].deposit,
        withdraw: annualMap[year].withdraw,
      }));
    data.push({
      label: "Present",
      value: Math.round(userPortfolioPresentValue),
      deposit: 0,
      withdraw: 0,
    });
    return data;
  }, [userHistoryData, userPortfolioPresentValue]);

  const initialAnnualValue = quarterlyData[0]?.value || 1;
  const finalAnnualValue = userPortfolioPresentValue;
  const cagr = calculateCAGR(
    initialAnnualValue,
    finalAnnualValue,
    annualData.length - 1
  );
  const absoluteReturn = calculateAbsoluteReturn(
    initialAnnualValue,
    finalAnnualValue
  );

  // Calculate total deposits and withdrawals
  const totalDeposits = userHistoryData.reduce(
    (acc, entry) => acc + entry.deposit,
    0
  );
  const totalWithdrawals = userHistoryData.reduce(
    (acc, entry) => acc + entry.withdraw,
    0
  );

  return (
    <Box sx={{ padding: 2, marginTop: 6 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 1 }}>
        <Grid container alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Portfolio Summary
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <MonetizationOnIcon color="primary" />
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ ml: 1 }}
              >
                Present Value: ₹
                {Math.round(userPortfolioPresentValue).toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <TrendingUpIcon color="success" />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                Total Return: <Typography variant="body2" color="success.main">{absoluteReturn}%</Typography>
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <SignalCellularAltIcon color="primary" />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ ml: 1, mb: 1 }}
              >
                CAGR: <Typography variant="body2" color="primary.main">{cagr}%</Typography>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <ArrowUpwardIcon color="primary" />
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ ml: 1 }}
              >
                Total Deposits: ₹{totalDeposits.toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <ArrowDownwardIcon color="secondary" />
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ ml: 1 }}
              >
                Total Withdrawals: ₹{totalWithdrawals.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {isLargeScreen ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <QuarterlyReturnChart quarterlyData={quarterlyData} />
          </Grid>
          <Grid item xs={6}>
            <AnnualReturnChart
              annualData={annualData}
              cagr={cagr}
              absoluteReturn={absoluteReturn}
            />
          </Grid>
        </Grid>
      ) : (
        <>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="Quarterly Returns" />
            <Tab label="Annual Returns" />
          </Tabs>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {selectedTab === 0 ? (
                <QuarterlyReturnChart quarterlyData={quarterlyData} />
              ) : (
                <AnnualReturnChart
                  annualData={annualData}
                  cagr={cagr}
                  absoluteReturn={absoluteReturn}
                />
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DataVisualization;
