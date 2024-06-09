// LargeScreenTable.jsx
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
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const getScopeColor = (scope) => {
  if (parseFloat(scope.replace("%", "")) >= 50) {
    return "success.main";
  } else if (parseFloat(scope.replace("%", "")) >= 30) {
    return "warning.main";
  } else {
    return "error.main";
  }
};

const LargeScreenTable = ({ data, handleSort, filteredData }) => {
  return (
    <TableContainer component={Paper} style={{marginBottom:"50px"}}>
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
            <StyledTableCell onClick={() => handleSort("presentQuarter")}>
              Present Quarter
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.stockName}</TableCell>
              <TableCell>{row.Sector}</TableCell>
              <TableCell>{row.pe}</TableCell>
              <TableCell>{row.marketCap}</TableCell>
              <TableCell>{row.LTP}</TableCell>
              <TableCell>{row.targetPrice}</TableCell>
              <TableCell sx={{ color: getScopeColor(row.scopeToGrow) }}>
                {row.scopeToGrow}
              </TableCell>
              <TableCell>{row.presentQuarter}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LargeScreenTable;
