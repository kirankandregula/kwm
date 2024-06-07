import React from "react";
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useData } from "../DataProvider";
import EtfTable from './EtfTable'; // Import the EtfTable component
import Star from "@mui/icons-material/Star";
import CompactETFCard from '../Etf/CompactETFCard'; // Import the corrected CompactETFCard component

const EtfService = () => {
  const { etfServiceData, loading } = useData(); // Access the etfServiceData and loading state from DataProvider
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isMidScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

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

  const calculateCorrection = (cmp, high) => {
    return ((high - cmp) / high) * 100;
  };

  // Group ETFs by correction percentage (5% increments) and find the one with the highest correction
  let maxCorrectionEtf = null;
  const groupedData = Object.entries(filteredData).reduce((acc, [_, etf]) => {
    const correction = calculateCorrection(etf.CMP, etf["52 week Heigh"]);
    const group = Math.floor(correction / 5) * 5;
    if (!acc[group]) acc[group] = [];
    acc[group].push({ ...etf, correction });

    if (!maxCorrectionEtf || correction > maxCorrectionEtf.correction) {
      maxCorrectionEtf = { ...etf, correction };
    }
    return acc;
  }, {});

  // Sort groups in descending order
  const sortedGroups = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Box sx={{ marginTop: 8, marginBottom: 2, padding: '16px' }}>
      {maxCorrectionEtf && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#e0f7fa', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Don't miss out on <strong>{maxCorrectionEtf["ETF Name"]}</strong> ! 
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
            {Array.from({ length: Math.floor(maxCorrectionEtf.correction / 5) }, (_, i) => (
              <Star key={i} sx={{ color: 'gold', fontSize: '30px' }} />
            ))}
          </Box>
        </Box>
      )}
      {isLargeScreen || isMidScreen ? (
        <EtfTable data={filteredData} />
      ) : (
        <Box>
          {sortedGroups.map(group => (
            <Box key={group}>
              <CompactETFCard data={groupedData[group]} range={group} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EtfService;
