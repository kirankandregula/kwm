import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";

const PortfolioSummary = ({
  presentValue,
  absoluteReturn,
  cagr,
  totalDeposits,
  totalWithdrawals,
}) => {
  return (
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
              Present Value: ₹{Math.round(presentValue).toLocaleString()}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <TrendingUpIcon color="success" />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
              Total Return:{" "}
              <Typography variant="body2" color="success.main">
                {absoluteReturn}%
              </Typography>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <SignalCellularAltIcon color="primary" />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ ml: 1, mb: 1 }}
            >
              CAGR:{" "}
              <Typography variant="body2" color="primary.main">
                {cagr}%
              </Typography>
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
  );
};

export default PortfolioSummary;
