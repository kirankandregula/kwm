// StocksInRadar.jsx
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useData } from "./DataProvider";
import {
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StockInRadar = () => {
  const { stockInRadarData, loading } = useData();
  const [filterValue, setFilterValue] = useState("");
  const [cookies] = useCookies(["userName", "userRole"]);
  const navigate = useNavigate();
  const [hasStocks, setHasStocks] = useState(false);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (!cookies.userName || !cookies.userRole) {
      navigate("/login");
    } else {
      if (stockInRadarData.some((stock) => stock.Ticker !== "")) {
        setHasStocks(true);
      }
      const sorted = [...stockInRadarData].sort(
        (a, b) =>
          parseFloat(b.stg.replace("%", "")) -
          parseFloat(a.stg.replace("%", ""))
      );
      setSortedData(sorted);
    }
  }, [cookies.userName, cookies.userRole, navigate, stockInRadarData]);

  const getScopeColor = (scope) => {
    if (parseFloat(scope.replace("%", "")) >= 50) {
      return "success.main";
    } else if (parseFloat(scope.replace("%", "")) >= 30) {
      return "warning.main";
    } else {
      return "error.main";
    }
  };

  const handleSort = (columnName) => {
    const sorted = [...sortedData].sort((a, b) =>
      a[columnName] > b[columnName] ? 1 : -1
    );
    setSortedData(sorted);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredData = sortedData.filter(
    (row) =>
      row.stock.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.industry.toLowerCase().includes(filterValue.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <ClipLoader
          color={"#36D7B7"}
          loading={loading}
          css={override}
          size={150}
        />
      </Box>
    );
  }

  if (!hasStocks) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h4" color="error">
          There are no stocks to buy now. Please wait for a few days.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={3}>
      <Typography
        variant="h2"
        color="success"
        textAlign="center"
        sx={{ marginTop: "70px" }}
      >
        Stocks in our Radar
      </Typography>
      <Box my={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Filter by stock name or industry"
          value={filterValue}
          onChange={handleFilterChange}
          sx={{ marginBottom: "20px" }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={() => handleSort("stock")}>
                  Stock
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("industry")}>
                  Industry
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("pe")}>
                  PE
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("ltp")}>
                  LTP
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("target")}>
                  Target
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("stg")}>
                  Scope to Grow
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.stock}</TableCell>
                  <TableCell>{row.industry}</TableCell>
                  <TableCell>{row.pe}</TableCell>
                  <TableCell>{row.ltp}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <TableCell sx={{ color: getScopeColor(row.stg) }}>
                    {row.stg}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default StockInRadar;
