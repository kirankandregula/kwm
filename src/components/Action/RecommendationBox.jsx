import React from "react";
import { Box, Typography } from "@mui/material";

const RecommendationBox = ({ recommendation }) => {
  const { stockName, LTP, quantity, totalValue, pe } = recommendation;

  return (
    <Box
      border={1}
      borderRadius={4}
      p={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
      borderColor="lightgrey"
    >
      <Box>
        <Typography variant="caption">PE. {pe}</Typography>
        <Typography variant="h6">{stockName}</Typography>
        <Typography variant="caption">QTY. {quantity}</Typography>
      </Box>
      <Box textAlign="right">
        <Typography variant="body2">LTP. {LTP}</Typography>
        <Typography variant="body2">TOTAL. {Math.round(totalValue)}</Typography>
      </Box>
    </Box>
  );
};

export default RecommendationBox;
