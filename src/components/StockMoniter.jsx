import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableContainer,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useData } from "./DataProvider"; // Adjust the import path as needed

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StockMonitor = () => {
  const { stockMonitorData, loading } = useData();
  const [filterValue, setFilterValue] = useState("");
  const [cookies] = useCookies(["userName", "userRole"]);
  const navigate = useNavigate(); // Ensure useNavigate is called at the top level of the component
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!cookies.userName || !cookies.userRole) {
      navigate("/login");
    } else {
      const sortedData = [...stockMonitorData].sort(
        (a, b) =>
          parseFloat(b.scopeToGrow.replace("%", "")) -
          parseFloat(a.scopeToGrow.replace("%", ""))
      );
      setData(sortedData);
    }
  }, [cookies.userName, cookies.userRole, navigate, stockMonitorData]);

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

  const handleSort = (columnName) => {
    const sortedData = [...data].sort((a, b) =>
      a[columnName] > b[columnName] ? 1 : -1
    );
    setData(sortedData);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredData = data.filter(
    (row) =>
      row.stockName && // Filter out rows where stockName is null or undefined
      (row.stockName.toLowerCase().includes(filterValue.toLowerCase()) ||
        row.Sector.toLowerCase().includes(filterValue.toLowerCase()))
  );

  return (
    <Box className="container mt-5">
      <Box
        className="row justify-content-center align-items-center"
        sx={{ minHeight: "80vh", padding: "20px" }}
      >
        {loading ? (
          <Box className="col-sm-12 text-center">
            <ClipLoader
              color={"#36D7B7"}
              loading={loading}
              css={override}
              size={50}
            />
          </Box>
        ) : (
          <Box className="col-md-12" sx={{ marginTop: "20px" }}>
            <Typography variant="h2" className="text-center sm-12">
              Stock Monitor
            </Typography>
            <Box className="form-group sm-12 my-2">
              <TextField
                fullWidth
                label="Filter by Stock Name or Sector"
                variant="outlined"
                value={filterValue}
                onChange={handleFilterChange}
              />
            </Box>
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
                    <StyledTableCell
                      onClick={() => handleSort("presentQuarter")}
                    >
                      Present Quarter
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, index) => (
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
                      <TableCell
                        sx={{ color: getMarketCapColor(row.marketCap) }}
                      >
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
                            row.average === "Average"
                              ? "error.main"
                              : "inherit",
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
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StockMonitor;
