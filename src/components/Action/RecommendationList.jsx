import React from "react";
import { Box, Typography } from "@mui/material";
import RecommendationBox from "./RecommendationBox";

const RecommendationList = ({
  buyRecommendations,
  totalBuyingAmount,
  averagePe,
}) => (
  <Box mb={2}>
    <Typography variant="body1">Average PE: {averagePe.toFixed(2)}</Typography>
    <Typography variant="body1">
      Total Amount: {Math.round(totalBuyingAmount)}
    </Typography>

    {buyRecommendations.map((recommendation, index) => (
      <RecommendationBox key={index} recommendation={recommendation} />
    ))}
  </Box>
);

export default RecommendationList;
