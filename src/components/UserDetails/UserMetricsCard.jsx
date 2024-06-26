import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { green, red} from "@mui/material/colors"; // Importing Material-UI colors

function UserMetricsCard({
  totalLatestValue,
  preValue,
}) {
  const quarterlyReturn = (
    ((totalLatestValue - preValue) / preValue) *
    100
  ).toFixed(2); // Calculate Quarterly Return

  const profitLoss = (totalLatestValue - preValue).toFixed(2);

  return (
    <Box 
      sx={{
        p: 2, 
        border: "1px solid #ccc", 
        borderRadius: "4px", 
        color: "black", 
        width: "100%"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="caption" >
          Previous
        </Typography>
        <Typography variant="caption" >
          Current
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {preValue.toLocaleString()}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {totalLatestValue.toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ borderBottom: "1px solid black", mb: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="caption" >
          <span>P&L </span>
          <strong style={{ color: profitLoss >= 0 ? green[500] : red[500] }}>{profitLoss >= 0 ? `+${profitLoss}` : profitLoss}</strong>
        </Typography>
        <Typography variant="caption" >
          <span>Return </span>
          <strong  style={{ color: profitLoss >= 0 ? green[500] : red[500] }}>{quarterlyReturn}%</strong>
        </Typography>
      </Box>
    </Box>
  );
}

UserMetricsCard.propTypes = {
  totalLatestValue: PropTypes.number.isRequired,
  preValue: PropTypes.number.isRequired,
};

export default UserMetricsCard;
