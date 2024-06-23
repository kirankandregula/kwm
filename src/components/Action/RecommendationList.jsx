import React from "react";
import { Box } from "@mui/material";
import RecommendationBox from "./RecommendationBox";

const RecommendationList = ({ recommendations }) => {
  return (
    <Box>
      {recommendations.map((recommendation, index) => (
        <RecommendationBox key={index} recommendation={recommendation} />
      ))}
    </Box>
  );
};

export default RecommendationList;
