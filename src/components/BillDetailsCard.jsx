import React from "react";

function BillDetailsCard({ preValue, presentValue }) {
  const quarterlyReturn = ((presentValue - preValue) / preValue * 100).toFixed(2); // Calculate Quarterly Return
  const billableReturn = ((presentValue - preValue) * 0.95).toFixed(2); // Calculate Billable Return
  const billableAmount = (billableReturn * 0.2).toFixed(2); // Calculate Billable Amount

  return (
    <div className="card mx-auto mt-4 my-2 text-white text-center" style={{ width: "300px" }}>
      <div className="card-body bg-info" style={{ borderRadius: "10px" }}>
        <h5 className="card-title text-center">Bill Details</h5>
        <p className="card-text">Previous Quarter Value: {preValue.toFixed(2)}</p>
        <p className="card-text">Present Value: {presentValue}</p>
        <p className="card-text">Quarterly Return: {quarterlyReturn}%</p>
        <p className="card-text">Billable Return (exclude 5%): {billableReturn}</p>
        <p className="card-text">Billable Amount: {billableAmount}</p>
      </div>
    </div>
  );
}

export default BillDetailsCard;
