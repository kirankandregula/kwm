import React from "react";
import { Box, Typography } from "@mui/material";
import RecommendationBox from "./RecommendationBox";
import { useData } from "../dataprovider/DataProvider";
import WarningIcon from "@mui/icons-material/Info";

const RecommendationList = ({ buyRecommendations, portfolioPE, totalBuyingAmount }) => {
  const { buyingWarning } = useData();

  return (
    <Box mb={2}>
      {buyingWarning.length > 0 && (
        <Box display="flex" alignItems="center" mb={2}>
          <WarningIcon color="warning" />
          <Typography variant="body1" color="warning.main" ml={1}>
            {buyingWarning[0]}
          </Typography>
        </Box>
      )}
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