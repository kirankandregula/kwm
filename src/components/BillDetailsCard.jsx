import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Box } from "@mui/material";
import "../css/BillDetailsCard.css"; // Importing custom CSS for additional styling if needed

function BillDetailsCard({ preValue, presentValue }) {
  const quarterlyReturn = (
    ((presentValue - preValue) / preValue) *
    100
  ).toFixed(2); // Calculate Quarterly Return
  const billableReturn = ((presentValue - preValue) * 0.95).toFixed(2); // Calculate Billable Return
  const billableAmount = (billableReturn * 0.2).toFixed(2); // Calculate Billable Amount

  return (
    <Box className="bill-card-container" sx={{ mt: 2 }}>
      <Card
        className="bill-card"
        sx={{ backgroundColor: "info.main", color: "white" }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            Bill Details
          </Typography>
          <Typography variant="body2">
            Previous Quarter Value: ₹{preValue.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            Present Value: ₹{presentValue.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            Quarterly Return: {quarterlyReturn}%
          </Typography>
          <Typography variant="body2">
            Billable Return (excluding 5%): ₹{billableReturn}
          </Typography>
          <Typography variant="body2" color="error">
            Billable Amount: ₹{billableAmount} to be paid
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

BillDetailsCard.propTypes = {
  preValue: PropTypes.number.isRequired,
  presentValue: PropTypes.number.isRequired,
};

export default BillDetailsCard;
