import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { green, orange, grey } from "@mui/material/colors"; // Importing Material-UI colors
import "../css/UserMetrics.css"; // Importing custom CSS for additional styling if needed

function UserMetricsCard({
  totalLatestValue,
  averagePE,
  averageScopeToGrow,
  preValue,
  gold,
  debt,
  equity,
}) {
  const quarterlyReturn = (
    ((totalLatestValue - preValue) / preValue) *
    100
  ).toFixed(2); // Calculate Quarterly Return

  const getColorClass = (quarterlyReturn) => {
    if (quarterlyReturn >= 10) {
      return green[500]; // Green for success
    } else if (quarterlyReturn < 10 && quarterlyReturn >= 5) {
      return orange[500]; // Orange for warning
    } else {
      return grey[500]; // Grey for secondary
    }
  };

  return (
    <Box className="card-container" sx={{ mt: 2 }}>
      <Card
        sx={{ backgroundColor: getColorClass(quarterlyReturn), color: "white" }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            Your Portfolio Details
          </Typography>
          <Typography variant="body2">
            Present Value: ₹{totalLatestValue.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Quarterly Return: {quarterlyReturn}%
          </Typography>
          <Typography variant="body2">Average PE: {averagePE}</Typography>
          <Typography variant="body2">
            Average Scope to Grow: {averageScopeToGrow}%
          </Typography>
          <Typography variant="body2">
            Equity: ₹{equity.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Gold: ₹{gold.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Debt: ₹{debt.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

UserMetricsCard.propTypes = {
  totalLatestValue: PropTypes.number.isRequired,
  averagePE: PropTypes.number.isRequired,
  averageScopeToGrow: PropTypes.number.isRequired,
  preValue: PropTypes.number.isRequired,
  gold: PropTypes.number.isRequired,
  debt: PropTypes.number.isRequired,
  equity: PropTypes.number.isRequired,
};

export default UserMetricsCard;
