import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { green, red } from "@mui/material/colors";

const RecommendationBox = ({ recommendation }) => {
  const { stockName, LTP, buyQuantity, TotalValue, PE, sector, scopeToGrow } =
    recommendation;

  const getScopeColor = (scope) => {
    const scopeValue = parseFloat(scope.replace("%", ""));
    return scopeValue >= 0 ? green[500] : red[500];
  };

  return (
    <Box
      border={1}
      borderRadius={2}
      p={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      mb="2px"
      borderColor="lightgrey"
    >
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="caption" color="textSecondary">
            PE. {PE} &bull; {sector}
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography variant="caption" color="textSecondary">
            STG:{" "}
            <span style={{ color: getScopeColor(scopeToGrow) }}>
              {scopeToGrow}
            </span>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1" fontWeight="bold">
            {stockName}
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography variant="caption" color="textSecondary">
            LTP:
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" display="inline">
            {LTP}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            QTY: <strong>{buyQuantity}</strong>
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography variant="caption" color="textSecondary">
            Total:
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" display="inline">
            {Math.round(TotalValue)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecommendationBox;
