import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { TextField, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useData } from "../DataProvider"; // Adjust the import path as needed
import CompactView from "./CompactMoniter"; // Adjust the import path as needed
import StockMonTable from "./StockMonTable";
import RefreshButton from "../RefreshButton";
import usePullToRefresh from "../usePullToRefresh";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const StockMonitor = () => {
  const { stockMonitorData, loading, fetchData,setLoading } = useData();
  const [filterValue, setFilterValue] = useState("");
  const [cookies] = useCookies(["userName", "userRole"]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [data, setData] = useState([]);


  usePullToRefresh(fetchData);

  useEffect(() => {
    if (!cookies.userName || !cookies.userRole) {
      navigate("/login");
    } else {
      const sortedData = [...stockMonitorData].sort(
        (a, b) =>
          parseFloat(a.scopeToGrow.replace("%", ""))-
          parseFloat(b.scopeToGrow.replace("%", "")) 
         
      );
      setData(sortedData);
    }
  }, [cookies.userName, cookies.userRole, navigate, stockMonitorData]);

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
    <Box className="container">
      <Box display="flex" justifyContent="center" mb={1}>
        <div className="d-flex justify-content-center mb-3">
          {isLargeScreen && (
            <RefreshButton
              handleClick={() => {
                setLoading(true);
                fetchData();
              }}
            />
          )}
        </div>
      </Box>
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
        <Box className="col-md-12">
          <Box className="form-group sm-12 mt-5 my-2">
            <TextField
              fullWidth
              label="Filter by Stock Name or Sector"
              variant="outlined"
              value={filterValue}
              onChange={handleFilterChange}
            />
          </Box>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <StockMonTable
              data={data}
              filteredData={filteredData}
              handleSort={handleSort}
            />
          </Box>
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <CompactView data={filteredData} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StockMonitor;
