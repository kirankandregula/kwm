import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

function DiversificationDiv({
  totalLatestValue,
  equity,
  gold,
  debt,
}) {
  return (
    <Box 
      sx={{
        p: 2, 
        border: "1px solid #ccc", 
        borderRadius: "4px", 
        backgroundColor: "white", 
        color: "black", 
        width: "100%",
        height: "130px"
      }}
    >
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">
          Current Value <strong>{totalLatestValue.toLocaleString()}</strong>
        </Typography>
      </Box>
      <Box sx={{ borderBottom: "1px solid black", mb: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="caption" >
          Equity: <strong>{equity.toLocaleString()}</strong>
        </Typography>
        <Typography variant="caption" >
          Gold: <strong>{gold.toLocaleString()}</strong>
        </Typography>
        <Typography variant="caption" >
          Debt: <strong>{debt.toLocaleString()}</strong>
        </Typography>
      </Box>
    </Box>
  );
}

DiversificationDiv.propTypes = {
  totalLatestValue: PropTypes.number.isRequired,
  equity: PropTypes.number.isRequired,
  gold: PropTypes.number.isRequired,
  debt: PropTypes.number.isRequired,
};

export default DiversificationDiv;
