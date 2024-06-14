import React from "react";
import PropTypes from "prop-types";
import { useData } from "../dataprovider/DataProvider";
import { TableRow, TableCell } from "@mui/material";
import { green, orange, red } from "@mui/material/colors"; // Import Material-UI colors
import "../../css/StockDetails.css"; // Importing custom CSS for additional styling if needed

function StockDetails({ stock }) {
  const { individualStockData } = useData(); // Get stock details data from context

  const stockData = individualStockData.find(
    (item) => item.stock_id === stock.stockId
  );

  if (!stockData) {
    return (
      <TableRow>
        <TableCell colSpan={12}>Loading...</TableCell>
      </TableRow>
    );
  }

  const latestValue = (stockData.LTP * stock.quantity).toFixed(2); // Round latest value

  // Determine row class based on scope to grow
  const scopeValue = parseInt(stockData.scopeToGrow.replace("%", ""));
  const rowClassName = scopeValue <= 10 ? "table-danger" : "";

  // const getColorClass = (quarterlyReturn) => {
  //   if (quarterlyReturn >= 10) {
  //     return green[500]; // Use green for success
  //   } else if (quarterlyReturn < 10 && quarterlyReturn >= 5) {
  //     return orange[500]; // Use orange for warning
  //   } else {
  //     return grey[500]; // Use grey for secondary
  //   }
  // };

  return (
    <TableRow className={rowClassName}>
      <TableCell>{stockData.stockName}</TableCell>
      <TableCell>{stockData.Sector}</TableCell>
      <TableCell>{stockData.pe}</TableCell>
      <TableCell>{stockData.marketCap}</TableCell>
      <TableCell
        style={{ color: stockData.action === "Hold" ? green[500] : red[500] }}
      >
        {stockData.action}
      </TableCell>
      <TableCell
        style={{
          color: stockData.average === "Average" ? red[500] : "inherit",
        }}
      >
        {stockData.average}
      </TableCell>
      <TableCell>{stock.quantity}</TableCell>
      <TableCell>{stockData.LTP}</TableCell>
      <TableCell>{stockData.targetPrice}</TableCell>
      <TableCell>{latestValue}</TableCell> {/* Display rounded latest value */}
      <TableCell style={{ color: getScopeToGrowColor(scopeValue) }}>
        {stockData.scopeToGrow}
      </TableCell>
      <TableCell>{stockData.presentQuarter}</TableCell>
    </TableRow>
  );
}

function getScopeToGrowColor(scopeValue) {
  if (scopeValue < 30) {
    return red[500];
  } else if (scopeValue >= 30 && scopeValue <= 50) {
    return orange[500];
  } else {
    return green[500];
  }
}

StockDetails.propTypes = {
  stock: PropTypes.shape({
    stockId: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default StockDetails;
