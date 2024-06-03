import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import "../css/CompactStockView.css";

const getQuarterlyReturnColor = (quarterlyReturn) => {
  if (quarterlyReturn > 50) return "green";
  if (quarterlyReturn >= 30 && quarterlyReturn <= 50) return "orange";
  return "red";
};

const getActionColor = (action) => {
  return action === "Hold" ? "green" : "red";
};

const CompactStockView = ({ filteredData, individualStockData }) => {
  return (
    <Box className="compact-stock-container">
      {filteredData.map((stock, index) => {
        const stockDetails = individualStockData.find(
          (item) => item.stock_id === stock.stockId
        );
        const quarterlyReturn = parseFloat(stockDetails.scopeToGrow);

        return (
          <Box key={index} className="compact-stock-view">
            <Grid container alignItems="center" className="stock-header">
              <Grid item xs={8}>
                <Typography variant="body2" className="stock-name">
                  <strong>{stockDetails.stockName}</strong> ({stock.quantity}) - {stockDetails.Sector}
                </Typography>
              </Grid>
              <Grid item xs={4} style={{ textAlign: "right" }}>
                <Typography
                  variant="body2"
                  style={{ color: getQuarterlyReturnColor(quarterlyReturn) }}
                >
                  {quarterlyReturn}%
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={0.5} className="stock-details">
              <Grid item xs={3}>
                <Typography variant="caption">PE: {stockDetails.pe}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">{stockDetails.marketCap}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" style={{ color: getActionColor(stockDetails.action) }}>
                  Act: {stockDetails.action}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">Qty: {stock.quantity}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">LTP: {stockDetails.LTP}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">TP: {stockDetails.targetPrice}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">LV: {(stockDetails.LTP * stock.quantity).toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">STG: {stockDetails.scopeToGrow}</Typography>
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default CompactStockView;
