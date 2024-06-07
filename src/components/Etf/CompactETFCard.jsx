import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

const correctionRanges = [3, 5, 10, 15, 20, 25, 30, 35];
const groupEtfsByCorrection = (etfs) => {
  return correctionRanges.map((range, index, array) => {
    const nextRange = array[index + 1] || Infinity; // Get the next range or Infinity if it's the last range
    const etfsInRange = etfs.filter((etf) => parseFloat(etf.correction) >= range && parseFloat(etf.correction) < nextRange);
    return {
      range,
      etfs: etfsInRange,
    };
  }).filter(group => group.etfs.length > 0); // Filter out empty groups
};

const CompactETFCard = ({ data }) => {
  if (!data) return null;

  const groupedEtfs = groupEtfsByCorrection(data);

  return (
    <Box>
      {groupedEtfs.map((group, index) => (
        <Card key={index} variant="outlined" sx={{ marginBottom: "10px", border: "1px solid lightgray" }}>
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs={10}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '8px'
                  }}
                >
                  {group.etfs.map((etf, etfIndex) => (
                    <Box
                      key={etfIndex}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Typography variant="body2" component="span">
                        <strong>{etf["ETF Name"]}</strong>
                      </Typography>
                      <Typography variant="body2" component="span" sx={{ mx: 1 }}>
                        &bull;
                      </Typography>
                      <Typography variant="caption" component="span">
                        {parseFloat(etf.correction).toFixed(2)}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={2} display="flex" alignItems="center" justifyContent="center">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: "red" }}>
                  {`${group.range}%`}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CompactETFCard;
