import React from "react";
import StockDetails from "./StockDetails";

function StockTable({ filteredData }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Stock ID</th>
            <th>Stock Name</th>
            <th>Sector</th>
            <th>PE</th>
            <th>Market Cap</th>
            <th>Target Price</th>
            <th>Low Price</th>
            <th>Scope to Grow</th>
            <th>Action</th>
            <th>Quantity</th>
            <th>LTP</th>
            <th>Latest Value</th>
          </tr>
        </thead>
        <tbody>
          {filteredData && filteredData.map((stock, index) => (
            <StockDetails key={index} stock={stock} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockTable;
