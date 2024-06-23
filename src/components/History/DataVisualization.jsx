import React, { useMemo, useState } from "react";
import { useData } from "../dataprovider/DataProvider"; // Adjust the path based on your project structure
import { Box, Grid, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";
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
import PortfolioSummary from "./PortfolioSummary";

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

const calculateCAGR = (initialValue, finalValue, cashFlows, years) => {
  const netCashFlow = cashFlows.reduce(
    (acc, { deposit, withdraw }) => acc + deposit - withdraw,
    0
  );
  const adjustedFinalValue = finalValue - netCashFlow + initialValue;
  const cagr = Math.pow(adjustedFinalValue / initialValue, 1 / years) - 1;
  return (cagr * 100).toFixed(2);
};

const calculateAbsoluteReturn = (initialValue, finalValue, cashFlows) => {
  const netCashFlow = cashFlows.reduce(
    (acc, { deposit, withdraw }) => acc + deposit - withdraw,
    0
  );
  const adjustedFinalValue = finalValue - netCashFlow + initialValue;
  const absoluteReturn = (
    ((adjustedFinalValue - initialValue) / initialValue) *
    100
  ).toFixed(2);
  return absoluteReturn < 0 ? 0 : absoluteReturn;
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

  const initialAnnualValue = annualData[0]?.value || 1;
  const finalAnnualValue = userPortfolioPresentValue;

  const cashFlows = userHistoryData.map((entry) => ({
    deposit: entry.deposit,
    withdraw: entry.withdraw,
  }));

  const cagr = calculateCAGR(
    initialAnnualValue,
    finalAnnualValue,
    cashFlows,
    annualData.length - 1
  );

  const absoluteReturn = calculateAbsoluteReturn(
    initialAnnualValue,
    finalAnnualValue,
    cashFlows
  );

  // Calculate total deposits and withdrawals
  const totalDeposits = cashFlows.reduce(
    (acc, { deposit }) => acc + deposit,
    0
  );
  const totalWithdrawals = cashFlows.reduce(
    (acc, { withdraw }) => acc + withdraw,
    0
  );

  return (
    <Box sx={{ padding: 2, marginTop: 6 }}>
      <PortfolioSummary
        presentValue={userPortfolioPresentValue}
        absoluteReturn={absoluteReturn}
        cagr={cagr}
        totalDeposits={totalDeposits}
        totalWithdrawals={totalWithdrawals}
      />

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
