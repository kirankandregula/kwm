import React from "react";
import PropTypes from "prop-types";
import '../css/BillDetailsCard.css'; // Importing custom CSS for styling

function BillDetailsCard({ preValue, presentValue }) {
  const quarterlyReturn = ((presentValue - preValue) / preValue * 100).toFixed(2); // Calculate Quarterly Return
  const billableReturn = ((presentValue - preValue) * 0.95).toFixed(2); // Calculate Billable Return
  const billableAmount = (billableReturn * 0.2).toFixed(2); // Calculate Billable Amount

  return (
    <div className="bill-card-container">
      <div className="bill-card bg-info">
        <div className="bill-card-body">
          <h5 className="bill-card-title">Bill Details</h5>
          <p className="bill-card-text">Previous Quarter Value: ₹{preValue.toFixed(2)}</p>
          <p className="bill-card-text">Present Value: ₹{presentValue.toFixed(2)}</p>
          <p className="bill-card-text">Quarterly Return: {quarterlyReturn}%</p>
          <p className="bill-card-text">Billable Return (excluding 5%): ₹{billableReturn}</p>
          <p className="bill-card-text">
            Billable Amount: <span className="text-danger">₹{billableAmount}</span> to be paid
          </p>
        </div>
      </div>
    </div>
  );
}

BillDetailsCard.propTypes = {
  preValue: PropTypes.number.isRequired,
  presentValue: PropTypes.number.isRequired,
};

export default BillDetailsCard;
