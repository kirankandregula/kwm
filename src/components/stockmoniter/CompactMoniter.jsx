import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

const getQuarterlyReturnColor = (quarterlyReturn) => {
  if (quarterlyReturn > 50) return "green";
  if (quarterlyReturn >= 30 && quarterlyReturn <= 50) return "orange";
  return "red";
};

const renderAvg = (average) => {
  if (average === "Average") {
    return (
      <span style={{ color: "red" }} className="mx-2">
        AVG
      </span>
    );
  }
  return null;
};

const renderAction = (action) => {
  if (action === "Hold") {
    return <span style={{ color: "green" }}>HOLD</span>;
  } else {
    return <span style={{ color: "red" }}>SELL</span>;
  }
};

const CompactMoniter = ({ data }) => {
  return (
    <Box>
      {data.map((item, index) => (
        <Card key={index} variant="outlined" sx={{ marginBottom: "10px", border: "1px solid black"
        }}>
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="caption">
                      PE. {item.pe} &nbsp; Qtr: {item.presentQuarter}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" style={{ textAlign: "right" }}>
                      {renderAvg(item.average)} {renderAction(item.action)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Grid container justifyContent="space-between">
                  <Grid item className="text-left">
                    <Typography variant="body1">
                      <strong>{item.stockName}</strong>
                    </Typography>
                  </Grid>
                  <Grid item className="text-right">
                    <Typography
                      variant="body2"
                      style={{ color: getQuarterlyReturnColor(parseFloat(item.scopeToGrow)) }}
                    >
                      {item.scopeToGrow}%
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} style={{ textAlign: "left" }}>
                <Typography variant="caption">
                  {item.Sector} &nbsp; {item.marketCap} 
                </Typography>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                LTP {item.LTP} &nbsp; TP {item.targetPrice}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CompactMoniter;
