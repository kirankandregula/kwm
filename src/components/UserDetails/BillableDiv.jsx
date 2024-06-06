import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

const getScopeColor = (scope) => {
  const scopeValue = parseFloat(scope.replace("%", ""));
  if (scopeValue <= 10) {
    return "error.light";
  } else if (scopeValue >= 50) {
    return "success.main";
  } else if (scopeValue >= 30) {
    return "warning.main";
  } else {
    return "error.main";
  }
};

function BillableDiv({ averagePE, averageScopeToGrow, preValue, presentValue }) {
  const billableReturn = ((presentValue - preValue) * 0.95).toFixed(2); // Calculate Billable Return
  const bill = (billableReturn * 0.2).toFixed(2); // Calculate Billable Amount
  const formattedBill = bill < 0 ? 0 : bill;
  const formattedBillableReturn = billableReturn < 0 ? 0 : billableReturn;

  return (
    <Box 
      sx={{
        p: 2, 
        border: "1px solid #ccc", 
        borderRadius: "4px", 
        backgroundColor: "white", 
        color: "black", 
        width: "100%"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          EX-Growth
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Bill
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "bold", 
            color: getScopeColor(averageScopeToGrow) 
          }}
        >
          {averageScopeToGrow}%
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {formattedBill}
        </Typography>
      </Box>
      <Box sx={{ borderBottom: "1px solid black", mb: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          PE: {averagePE}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Billable Return: {formattedBillableReturn}
        </Typography>
      </Box>
    </Box>
  );
}

BillableDiv.propTypes = {
  averagePE: PropTypes.number.isRequired,
  averageScopeToGrow: PropTypes.string.isRequired,
  preValue: PropTypes.number.isRequired,
  presentValue: PropTypes.number.isRequired,
};

export default BillableDiv;
