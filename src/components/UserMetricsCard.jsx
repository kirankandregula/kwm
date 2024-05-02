import React from "react";

function UserMetricsCard({ totalLatestValue, averagePE, averageScopeToGrow, preValue, gold, debt, equity }) {
  const quarterlyReturn = ((totalLatestValue - preValue) / preValue * 100).toFixed(2); // Calculate Quarterly Return
  const getColorClass = (quarterlyReturn) => {
    if (quarterlyReturn < 5) {
      return "bg-secondary";
    } else if (quarterlyReturn >= 5 && quarterlyReturn <= 10) {
      return "bg-warning";
    } else {
      return "bg-success";
    }
  };

  return (
    <div className="card mx-auto mt-4 my-2 text-white text-center" style={{ width: "300px" }}>
      <div className={`card-body ${getColorClass(quarterlyReturn)}`} style={{ borderRadius: "10px" }}>
        <h5 className="card-title text-center">User Metrics</h5>
        <p className="card-text">Present Value: {totalLatestValue}</p>
        <p className="card-text">Quarterly Return: {quarterlyReturn}%</p>
        <p className="card-text">Average PE: {averagePE}</p>
        <p className="card-text">Average Scope to Grow: {averageScopeToGrow}</p>
        <p className="card-text">Equity: {equity}</p>
        <p className="card-text">Gold: {gold}</p>
        <p className="card-text">Debt: {debt}</p>
      </div>
    </div>
  );
}

export default UserMetricsCard;
