import React, { useState } from "react";
import StockDetails from "./StockDetails";

function StockTable({ filteredData }) {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (sortConfig !== null) {
      return [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredData;
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort("stock_id")}>Stock ID</th>
            <th onClick={() => handleSort("stockName")}>Stock Name</th>
            <th onClick={() => handleSort("sector")}>Sector</th>
            <th onClick={() => handleSort("pe")}>PE</th>
            <th onClick={() => handleSort("marketCap")}>Market Cap</th>
            <th onClick={() => handleSort("targetPrice")}>Target Price</th>
            <th onClick={() => handleSort("lowPrice")}>Low Price</th>
            <th onClick={() => handleSort("scopeToGrow")}>Scope to Grow</th>
            <th onClick={() => handleSort("action")}>Action</th>
            <th onClick={() => handleSort("quantity")}>Quantity</th>
            <th onClick={() => handleSort("LTP")}>LTP</th>
            <th onClick={() => handleSort("latestValue")}>Latest Value</th>
          </tr>
        </thead>
        <tbody>
          {sortedData().map((stock, index) => (
            <StockDetails key={index} stock={stock} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockTable;
