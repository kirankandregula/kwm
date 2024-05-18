import React from "react";
import StockDetails from "./StockDetails";
import '../css/StockTable.css'; // Importing. custom CSS for styling

function StockTable({ filteredData }) {
  return (
    <div className="table-responsive stock-table-container">
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Stock Name</th>
            <th>Sector</th>
            <th>PE</th>
            <th>Market Cap</th>
            <th>Action</th>
            <th>Average</th>
            <th>Quantity</th>
            <th>LTP</th>
            <th>Target Price</th>
            <th>Latest Value</th>
            <th>Scope to Grow</th>
            <th>Present Quarter</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((stock, index) => (
            <StockDetails key={index} stock={stock} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockTable;
