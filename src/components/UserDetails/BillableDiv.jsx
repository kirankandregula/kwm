import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";

const getScopeColor = (scope) => {
  const scopeValue = parseFloat(scope.replace("%", ""));
  return scopeValue >= 0 ? green[500] : red[500];
};

function BillableDiv({
  averagePE,
  averageScopeToGrow,
  preValue,
  presentValue,
}) {
  const quarterlyReturn = ((presentValue - preValue) / preValue) * 100;
  const billableReturn =
    quarterlyReturn < 5 ? 0 : ((presentValue - preValue) * 0.95).toFixed(2); // Calculate Billable Return
  const bill = quarterlyReturn < 5 ? 0 : (billableReturn * 0.2).toFixed(2); // Calculate Billable Amount
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
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          Bill
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          EX.Growth
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {formattedBill}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: getScopeColor(averageScopeToGrow),
          }}
        >
          {averageScopeToGrow}%
        </Typography>
      </Box>
      <Box sx={{ borderBottom: "1px solid black", mb: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          Billable Return {formattedBillableReturn}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          PE {averagePE}
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
