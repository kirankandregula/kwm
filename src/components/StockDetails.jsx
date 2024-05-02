import React, { useState, useEffect } from "react";
import axios from "axios";

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
    return <tr><td colSpan="12">Loading...</td></tr>;
  }

  if (!stockData) {
    return null;
  }

  const latestValue = (stockData.LTP * stock.quantity).toFixed(2); // Round latest value

  return (
    <tr>
      <td>{stock.stockId}</td>
      <td>{stockData.stockName}</td>
      <td>{stockData.Sector}</td>
      <td>{stockData.pe}</td>
      <td>{stockData.marketCap}</td>
      <td>{stockData.targetPrice}</td>
      <td>{stockData.lowPrice}</td>
      <td style={{ color: getScopeToGrowColor(stockData.scopeToGrow) }}>{stockData.scopeToGrow}</td>
      <td>{stockData.action}</td>
      <td>{stock.quantity}</td>
      <td>{stockData.LTP}</td>
      <td>{latestValue}</td> {/* Display rounded latest value */}
    </tr>
  );
}

function getScopeToGrowColor(scopeToGrow) {
  if (typeof scopeToGrow !== 'string') {
    // Handle the case where scopeToGrow is not a string
    return 'black'; // Return a default color or handle it as needed
  }

  const scopeValue = parseInt(scopeToGrow.replace('%', ''));
  if (scopeValue < 30) {
    return 'red';
  } else if (scopeValue >= 30 && scopeValue <= 50) {
    return 'orange';
  } else {
    return 'green';
  }
}

export default StockDetails;
