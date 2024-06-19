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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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
    }));
    data.push({
      label: "Present",
      value: Math.round(userPortfolioPresentValue),
    });
    return data;
  }, [userHistoryData, userPortfolioPresentValue]);

  const annualData = useMemo(() => {
    const annualMap = {};
    userHistoryData.forEach((entry) => {
      const year = getYearLabel(entry.quarter);
      if (!annualMap[year]) {
        annualMap[year] = entry.closingValue;
      } else {
        annualMap[year] = Math.max(annualMap[year], entry.closingValue);
      }
    });
    const data = Object.keys(annualMap)
      .slice(-4)
      .map((year) => ({
        label: year,
        value: annualMap[year],
      }));
    data.push({
      label: "Present",
      value: Math.round(userPortfolioPresentValue),
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

  return (
    <Box sx={{ padding: 2, marginTop: 6 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
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
            Total Return: {absoluteReturn}%
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <CheckCircleIcon color="primary" />
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
            CAGR: {cagr}%
          </Typography>
        </Box>
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
