// CompactView.jsx
import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

const getQuarterlyReturnColor = (quarterlyReturn) => {
  if (quarterlyReturn > 50) return "green";
  if (quarterlyReturn >= 30 && quarterlyReturn <= 50) return "orange";
  return "red";
};

const CompactView = ({ data }) => {
  return (
    <Box sx={{ mb: 8 }}>
      {data.map((item, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{ marginBottom: "2px", border: "1px solid lightgray" }}
        >
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="caption">
                      PE. {item.pe}
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ mx: 0.5 }}
                      >
                        &bull;
                      </Typography>
                      Qtr. {item.presentQuarter}
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
                      style={{
                        color: getQuarterlyReturnColor(
                          parseFloat(item.scopeToGrow)
                        ),
                        fontSize: "1.2rem", // Make the text larger
                      }}
                    >
                      {item.scopeToGrow}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} style={{ textAlign: "left" }}>
                <Typography variant="caption">
                  {item.Sector}
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ mx: 0.5 }}
                  >
                    &bull;
                  </Typography>
                  {item.marketCap}
                </Typography>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Typography variant="caption">
                  LTP {item.LTP}
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ mx: 0.5 }}
                  >
                    &bull;
                  </Typography>
                  TP {item.targetPrice}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CompactView;
