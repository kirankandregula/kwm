import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const RecommendationBox = ({ recommendation }) => {
  const { stockName, LTP, buyQuantity, TotalValue, PE } = recommendation;

  return (
    <Box
      border={1}
      borderRadius={4}
      p={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
      borderColor="lightgrey"
      boxShadow={1}
    >
      <Box>
        <Typography variant="caption" color="textSecondary">
          PE: {PE}
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {stockName}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Quantity: {buyQuantity}
        </Typography>
      </Box>
      <Box textAlign="right">
        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Grid item>
            <Typography variant="caption" color="textSecondary">
              LTP:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" fontWeight="bold">
              {LTP}
            </Typography>
          </Grid>
          <Grid item xs={12} />
          <Grid item>
            <Typography variant="caption" color="textSecondary">
              Total:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" fontWeight="bold">
              {Math.round(TotalValue)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RecommendationBox;
