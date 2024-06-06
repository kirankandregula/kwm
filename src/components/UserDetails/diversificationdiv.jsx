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
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" ,mb: 1 }}>
          Current Value: {totalLatestValue.toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ borderBottom: "1px solid black", mb: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Equity: {equity.toLocaleString()}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Gold: {gold.toLocaleString()}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Debt: {debt.toLocaleString()}
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
