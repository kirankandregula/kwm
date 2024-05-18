import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import '../css/StockDetails.css'; // Importing custom CSS for styling

function StockDetails({ stock }) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          `https://script.googleusercontent.com/macros/echo?user_content_key=M8iUr2Z4ujhnZj3gV3jqyikffgyvfGGgE3LB3d7khmmrPclpYpwHDJT4UsbuwsGWdk_NjhcYGkEiZFHb0g2ZI4og0-Tok6FKm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz&stock_id=${stock.stockId}`
        );
        const fetchedStockData = response.data.find(item => item.stock_id === stock.stockId);
        setStockData(fetchedStockData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [stock]);

  if (loading) {
    return <tr><td >Loading...</td></tr>;
  }

  if (!stockData) {
    return null;
  }

  const latestValue = (stockData.LTP * stock.quantity).toFixed(2); // Round latest value

  // Determine row class based on scope to grow
  const scopeValue = parseInt(stockData.scopeToGrow.replace('%', ''));
  const rowClassName = scopeValue <= 10 ? 'table-danger' : '';

  return (
    <tr className={rowClassName}>
      <td>{stockData.stockName}</td>
      <td>{stockData.Sector}</td>
      <td>{stockData.pe}</td>
      <td>{stockData.marketCap}</td>
      <td className={stockData.action === "Hold" ? "text-success" : "text-danger"}>{stockData.action}</td>
      <td className={stockData.average === "Average" ? "text-danger" : ""}>{stockData.average}</td>
      <td>{stock.quantity}</td>
      <td>{stockData.LTP}</td>
      <td>{stockData.targetPrice}</td>
      <td>{latestValue}</td> {/* Display rounded latest value */}
      <td style={{ color: getScopeToGrowColor(scopeValue) }}>{stockData.scopeToGrow}</td>
      <td>{stockData.presentQuarter}</td>
    </tr>
  );
}

function getScopeToGrowColor(scopeValue) {
  if (scopeValue < 30) {
    return 'red';
  } else if (scopeValue >= 30 && scopeValue <= 50) {
    return 'orange';
  } else {
    return 'green';
  }
}

StockDetails.propTypes = {
  stock: PropTypes.shape({
    stockId: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired
  }).isRequired
};

export default StockDetails;
