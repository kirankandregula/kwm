import React from "react";
import PropTypes from "prop-types";
import { useData } from "./DataProvider";
import "../css/StockDetails.css"; // Importing custom CSS for styling

function StockDetails({ stock }) {
  const { individualStockData } = useData(); // Get stock details data from context

  const stockData = individualStockData.find(
    (item) => item.stock_id === stock.stockId
  );

  if (!stockData) {
    return (
      <tr>
        <td>Loading...</td>
      </tr>
    );
  }

  const latestValue = (stockData.LTP * stock.quantity).toFixed(2); // Round latest value

  // Determine row class based on scope to grow
  const scopeValue = parseInt(stockData.scopeToGrow.replace("%", ""));
  const rowClassName = scopeValue <= 10 ? "table-danger" : "";

  return (
    <tr className={rowClassName}>
      <td>{stockData.stockName}</td>
      <td>{stockData.Sector}</td>
      <td>{stockData.pe}</td>
      <td>{stockData.marketCap}</td>
      <td
        className={stockData.action === "Hold" ? "text-success" : "text-danger"}
      >
        {stockData.action}
      </td>
      <td className={stockData.average === "Average" ? "text-danger" : ""}>
        {stockData.average}
      </td>
      <td>{stock.quantity}</td>
      <td>{stockData.LTP}</td>
      <td>{stockData.targetPrice}</td>
      <td>{latestValue}</td> {/* Display rounded latest value */}
      <td style={{ color: getScopeToGrowColor(scopeValue) }}>
        {stockData.scopeToGrow}
      </td>
      <td>{stockData.presentQuarter}</td>
    </tr>
  );
}

function getScopeToGrowColor(scopeValue) {
  if (scopeValue < 30) {
    return "red";
  } else if (scopeValue >= 30 && scopeValue <= 50) {
    return "orange";
  } else {
    return "green";
  }
}

StockDetails.propTypes = {
  stock: PropTypes.shape({
    stockId: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default StockDetails;
