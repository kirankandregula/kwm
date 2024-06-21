import React from "react";
import { Box, Typography } from "@mui/material";
import RecommendationBox from "./RecommendationBox";

const RecommendationList = ({
  buyRecommendations,
  portfolioPE,
  totalBuyingAmount,
}) => {
  return (
    <Box mb={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="body1">
          <strong>Average PE:</strong> {portfolioPE.toFixed(2) || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Total Amount:</strong> {Math.round(totalBuyingAmount)}
        </Typography>
      </Box>
      {buyRecommendations.map((recommendation, index) => (
        <RecommendationBox key={index} recommendation={recommendation} />
      ))}
    </Box>
  );
};

export default RecommendationList;