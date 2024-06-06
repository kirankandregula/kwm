import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableContainer,
  Paper,
  TableCell,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import  { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const getScopeColor = (scope) => {
  const scopeValue = parseFloat(scope.replace("%", ""));
  if (scopeValue <= 10) {
    return "error.light";
  } else if (scopeValue >= 50) {
    return "success.main";
  } else if (scopeValue >= 30) {
    return "warning.main";
  } else {
    return "error.main";
  }
};

const getHoldSellColor = (holdSell) => {
  return holdSell === "Hold" ? "success.main" : "error.main";
};

const getMarketCapColor = (marketCap) => {
  switch (marketCap) {
    case "Large Cap":
      return "success.main";
    case "Medium Cap":
      return "warning.main";
    case "Small Cap":
      return "error.main";
    default:
      return "";
  }
};

const StockMonTable = ({ data, handleSort }) => (
  <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell onClick={() => handleSort("stockName")}>
            Stock Name
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort("Sector")}>
            Sector
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort("pe")}>
            PE
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort("marketCap")}>
            Market Cap
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort("LTP")}>
            LTP
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort("targetPrice")}>
            Target Price
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort("scopeToGrow")}>
            Scope to Grow
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort("action")}>
            Hold/Sell
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort("average")}>
            Average
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort("presentQuarter")}>
            Present Quarter
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={index}
            sx={{
              bgcolor:
                parseFloat(row.scopeToGrow.replace("%", "")) <= 10
                  ? "error.light"
                  : "inherit",
            }}
          >
            <TableCell>{row.stockName}</TableCell>
            <TableCell>{row.Sector}</TableCell>
            <TableCell>{row.pe}</TableCell>
            <TableCell sx={{ color: getMarketCapColor(row.marketCap) }}>
              {row.marketCap}
            </TableCell>
            <TableCell>{row.LTP}</TableCell>
            <TableCell>{row.targetPrice}</TableCell>
            <TableCell sx={{ color: getScopeColor(row.scopeToGrow) }}>
              {row.scopeToGrow}
            </TableCell>
            <TableCell sx={{ color: getHoldSellColor(row.action) }}>
              {row.action}
            </TableCell>
            <TableCell
              sx={{
                color:
                  row.average === "Average" ? "error.main" : "inherit",
              }}
            >
              {row.average}
            </TableCell>
            <TableCell>{row.presentQuarter}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default StockMonTable;
