import React from "react";
import PropTypes from "prop-types";
import '../css/UserMetrics.css'; // Importing custom CSS for styling

function UserMetricsCard({ totalLatestValue, averagePE, averageScopeToGrow, preValue, gold, debt, equity }) {
  const quarterlyReturn = (((totalLatestValue - preValue) / preValue) * 100).toFixed(2); // Calculate Quarterly Return

  const getColorClass = (quarterlyReturn) => {
    if (quarterlyReturn <= 5) {
      return "bg-secondary";
    } else if (quarterlyReturn <= 10) {
      return "bg-warning";
    } else {
      return "bg-success";
    }
  };

  return (
    <div className="card-container">
      <div className={`card ${getColorClass(quarterlyReturn)}`}>
        <div className="card-body">
          <h5 className="card-title">Your Portfolio Details</h5>
          <p className="card-text">Present Value: ₹{totalLatestValue.toLocaleString()}</p>
          <p className="card-text" >Quarterly Return: <span style={{fontWeight: 700}}>{ quarterlyReturn}%</span> </p>
          <p className="card-text">Average PE: {averagePE}</p>
          <p className="card-text">Average Scope to Grow: {averageScopeToGrow}%</p>
          <p className="card-text">Equity: ₹{equity.toLocaleString()}</p>
          <p className="card-text">Gold: ₹{gold.toLocaleString()}</p>
          <p className="card-text">Debt: ₹{debt.toLocaleString()}</p>
        </div>
      </div>
    </div>
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
