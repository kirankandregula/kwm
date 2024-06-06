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
      <span style={{ color: "red" }} className="mx-2">
        Avg
      </span>
    );
  }
  return null;
};

const renderAction = (action) => {
  if (action === "Hold") {
    return <span style={{ color: "green" }}>Hold</span>;
  } else {
    return <span style={{ color: "red" }}>Sell</span>;
  }
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
          <Box
            className="compact-stock-view"
            sx={{
              p: 2,
              border: "1px solid #ccc",
              borderRadius: "4px",
              color: "black",
              width: "100%",
            }}
            style ={{marginBottom: "2px"}}
          >
            <Grid container  alignItems="center" className="stock-header" > 
              <Grid item xs={12} className="stock-details" >
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="caption">
                      Qty. {stock.quantity}
                      <span style={{ marginLeft: "2px" }}></span> PE.{" "}
                      {stockDetails.pe}
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
                      <span variant="caption">
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
                  <span style={{ marginLeft: "5px" }}></span>{" "}
                  {stockDetails.marketCap}
                </Typography>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                LTP. {stockDetails.LTP}{" "}
                <span style={{ marginLeft: "5px" }}></span>TP.{" "}
                {stockDetails.targetPrice}
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default CompactStockView;
