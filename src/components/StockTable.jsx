import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import StockDetails from "./StockDetails";
import "../css/StockTable.css"; // Importing custom CSS for additional styling if needed

function StockTable({ filteredData }) {
  return (
    <TableContainer component={Paper} className="stock-table-container">
      <Table className="table-hover" aria-label="stock table">
        <TableHead className="thead-dark">
          <TableRow>
            <TableCell>Stock Name</TableCell>
            <TableCell>Sector</TableCell>
            <TableCell>PE</TableCell>
            <TableCell>Market Cap</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Average</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>LTP</TableCell>
            <TableCell>Target Price</TableCell>
            <TableCell>Latest Value</TableCell>
            <TableCell>Scope to Grow</TableCell>
            <TableCell>Present Quarter</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((stock, index) => (
            <StockDetails key={index} stock={stock} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StockTable;
