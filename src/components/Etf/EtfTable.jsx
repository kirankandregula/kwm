import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const EtfTable = ({ data }) => {
  const calculateCorrection = (cmp, high) => {
    return ((high - cmp) / high) * 100;
  };

  const getStarRating = (correction) => {
    const stars = Math.round(correction / 10); // Adjust this calculation as per your requirement
    return Array.from({ length: 5 }, (_, index) => index < stars);
  };

  const sortedData = Object.entries(data).sort(([, a], [, b]) => {
    const correctionA = calculateCorrection(a.CMP, a["52 week Heigh"]);
    const correctionB = calculateCorrection(b.CMP, b["52 week Heigh"]);
    return correctionB - correctionA; // Descending order
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Stock</TableCell>
            <TableCell>CMP</TableCell>
            <TableCell>Correction</TableCell>
            <TableCell>Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map(([stock, details]) => {
            const correction = calculateCorrection(details.CMP, details["52 week Heigh"]);
            const stars = getStarRating(correction);

            return (
              <TableRow key={stock}>
                <TableCell>{details["ETF Name"]}</TableCell>
                <TableCell>{details.CMP}</TableCell>
                <TableCell>{correction.toFixed(2)}%</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {stars.map((filled, index) =>
                      filled ? (
                        <StarIcon key={index} color="primary" />
                      ) : (
                        <StarBorderIcon key={index} color="primary" />
                      )
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EtfTable;
