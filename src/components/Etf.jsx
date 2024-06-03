import React from "react";
// import { ClipLoader } from "react-spinners";
import { useData } from "./DataProvider"; // Import the DataProvider
import { Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
// import { css } from "@emotion/react";

// const override = css`
//   display: block;
//   margin: 0 auto;
//   border-color: red;
// `;

const EtfService = () => {
  const { etfServiceData, loading } = useData(); // Access the etfServiceData and loading state from DataProvider

  const filteredData = Object.entries(etfServiceData)
    .filter(
      ([_, details]) =>
        !Object.values(details).every((value) => value === "NA") &&
        details["ETF Name"] !== ""
    )
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const triggerColumns = Object.keys(filteredData[Object.keys(filteredData)[0]])
    .slice(2)
    .filter((col) =>
      Object.values(filteredData).some((details) => details[col] === "TRIGGER")
    );

  return (
    <Box sx={{ marginTop: 10, marginBottom: 10 }}>
      <Typography variant="h2" align="center" color="textSecondary" gutterBottom>
        ETF Service
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Stock</TableCell>
              <TableCell>CMP</TableCell>
              {triggerColumns.map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(filteredData).map(([stock, details]) => (
              <TableRow key={stock}>
                <TableCell>{details["ETF Name"]}</TableCell>
                <TableCell>{details.CMP}</TableCell>
                {triggerColumns.map((col) => (
                  <TableCell
                    key={col}
                    sx={{ color: details[col] === "TRIGGER" ? "error.main" : "inherit" }}
                  >
                    {details[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EtfService;
