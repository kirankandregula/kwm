import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  Tooltip,
  IconButton,
  Modal,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DuplicateIcon from "@mui/icons-material/Error"; // Assuming this is the icon for duplicates
import LargeScreenTable from "./LargeScreenTable";
import CompactView from "./CompactView";
import { useData } from "../dataprovider/DataProvider";


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const StockInRadar = () => {
  const { stockInRadarData, individualStockData, loading } = useData();
  const [filterValue, setFilterValue] = useState("");
  const [cookies] = useCookies(["userName", "userRole"]);
  const navigate = useNavigate();
  const [sortedData, setSortedData] = useState([]);
  const [duplicateStocks, setDuplicateStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));



  useEffect(() => {
    if (!cookies.userName || !cookies.userRole) {
      navigate("/login");
    } else {
      const combinedData = [...stockInRadarData, ...individualStockData];
      const uniqueData = [];
      const duplicates = [];

      combinedData.forEach((stock) => {
        if (uniqueData.find((item) => item.stockName === stock.stockName)) {
          duplicates.push(stock.stockName);
        } else {
          uniqueData.push(stock);
        }
      });

      setDuplicateStocks([...new Set(duplicates)]); // Remove duplicate entries in duplicates

      const sorted = [...uniqueData].sort(
        (a, b) =>
          parseFloat(b.scopeToGrow.replace("%", "")) -
          parseFloat(a.scopeToGrow.replace("%", ""))
      );
      setSortedData(sorted);
    }
  }, [
    cookies.userName,
    cookies.userRole,
    navigate,
    stockInRadarData,
    individualStockData,
  ]);

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
      row.stockName.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.Sector.toLowerCase().includes(filterValue.toLowerCase())
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

  if (filteredData.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="body2" color="error">
          There are no stocks to buy now. Please wait for a few days.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={10}>
      <Box my={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Filter by stock name or industry"
          value={filterValue}
          onChange={handleFilterChange}
          sx={{ marginBottom: "20px" }}
        />
        {duplicateStocks.length > 0 && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Show Duplicates">
              <IconButton color="error" onClick={() => setIsModalOpen(true)} type="button">
                <DuplicateIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" color="error">
              Duplicates found
            </Typography>
          </Box>
        )}
        {isLargeScreen ? (
          <LargeScreenTable
            data={sortedData}
            filteredData={filteredData}
            handleSort={handleSort}
          />
        ) : (
          <CompactView data={filteredData} />
        )}
      </Box>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="duplicate-stocks-modal"
        aria-describedby="modal-to-show-duplicate-stocks"
      >
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "500px",
            padding: "20px",
          }}
        >
          <Typography variant="h6" id="duplicate-stocks-modal" gutterBottom>
            Duplicate Stocks
          </Typography>
          <List>
            {duplicateStocks.map((stock, index) => (
              <ListItem key={index}>
                <ListItemText primary={stock} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Modal>
    </Box>
  );
};

export default StockInRadar;
