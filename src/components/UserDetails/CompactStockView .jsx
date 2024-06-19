import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const getQuarterlyReturnColor = (quarterlyReturn) => {
  if (quarterlyReturn > 50) return "green";
  if (quarterlyReturn >= 30 && quarterlyReturn <= 50) return "orange";
  return "red";
};

const renderAvg = (average) => {
  if (average === "Average") {
    return (
      <span key="avg" style={{ color: "red" }} className="mx-2">
        Avg
      </span>
    );
  }
  return null;
};

const renderAction = (action) => {
  if (action === "Hold") {
    return (
      <span key="hold" style={{ color: "green" }}>
        Hold
      </span>
    );
  } else {
    return (
      <span key="sell" style={{ color: "red" }}>
        Sell
      </span>
    );
  }
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
          <Box
            key={stock.stockId} // Adding unique key prop here
            className="compact-stock-view"
            sx={{
              p: 2,
              border: "1px solid #ccc",
              borderRadius: "4px",
              color: "black",
              width: "100%",
            }}
            style={{ marginBottom: "2px" }}
          >
            <Grid container alignItems="center" className="stock-header">
              <Grid item xs={12} className="stock-details">
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="caption">
                      Qty. {stock.quantity}
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ mx: 0.5 }}
                      >
                        &bull;
                      </Typography>
                      PE. {stockDetails.pe}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="caption"
                      style={{ textAlign: "right" }}
                    >
                      {renderAvg(stockDetails.average)}{" "}
                      {renderAction(stockDetails.action)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container alignItems="center" className="stock-header">
              <Grid item xs={12} className="stock-details">
                <Grid container justifyContent="space-between">
                  <Grid item className="text-left">
                    <Typography>
                      <strong variant="body2">{stockDetails.stockName}</strong>

                      <span variant="caption" style={{ fontSize: "0.7rem" }}>
                        {" "}
                        {(stockDetails.LTP * stock.quantity).toFixed(2)}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item className="text-right">
                    <Typography
                      variant="body2"
                      style={{
                        color: getQuarterlyReturnColor(quarterlyReturn),
                      }}
                    >
                      {quarterlyReturn}%
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container className="stock-details">
              <Grid item xs={6} style={{ textAlign: "left" }}>
                <Typography variant="caption">
                  {stockDetails.Sector}{" "}
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ mx: 0.5 }}
                  >
                    &bull;
                  </Typography>
                  {stockDetails.marketCap}
                </Typography>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Typography variant="caption">
                  LTP. {stockDetails.LTP}{" "}
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ mx: 0.5 }}
                  >
                    &bull;
                  </Typography>
                  TP. {stockDetails.targetPrice}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default CompactStockView;
