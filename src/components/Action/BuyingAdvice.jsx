import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
} from "@mui/material";
import RecommendationList from "./RecommendationList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WarningIcon from "@mui/icons-material/Warning";
import { useTheme } from "@mui/material/styles";
import ConfirmationDialog from "./ConfirmationDialog";
import { useData } from "../dataprovider/DataProvider";

const BuyingAdvice = () => {
  const {
    buyRecommendations,
    buyingWarning,
    portfolioPE,
    sectors,
    generateBuyingAdvice,
    setSelectedSectors,
    selectedSectors,
    portfolioScopeToGrow,
    setBuyingWarning,
  } = useData();
  const [showAdviceDialog, setShowAdviceDialog] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [totalBuyingAmount, setTotalBuyingAmount] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCloseDialog = () => {
    setShowAdviceDialog(false);
    setSelectedSectors([]);
    setBuyingWarning([]);
  };

  const handleGenerateAdviceClick = () => {
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationDialogOpen(false);
  };

  const handleConfirmGenerateAdvice = () => {
    setShowAdviceDialog(true);
    handleCloseConfirmation();
    generateBuyingAdvice(selectedSectors);
  };

  const handleSectorChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedSectors(selectedValues);

    generateBuyingAdvice(selectedValues);
  };

  useEffect(() => {
    if (buyRecommendations.length > 0) {
      const total = buyRecommendations.reduce((acc, rec) => {
        const amount = rec.LTP * rec.buyQuantity;
        return acc + amount;
      }, 0);
      setTotalBuyingAmount(total);
    }
  }, [buyRecommendations]);

  return (
    <Box
      className="buying-advice-container"
      display="flex"
      justifyContent="center"
      padding="0 16px"
      marginTop={2}
      flexDirection={isSmallScreen ? "column" : "row"}
      alignItems={isSmallScreen ? "center" : "flex-start"}
    >
      <Box
        className="initial-recommendation"
        textAlign="center"
        padding={isSmallScreen ? "16px" : "24px"}
        border="1px solid #ccc"
        borderRadius="8px"
        backgroundColor="#f9f9f9"
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
        minHeight={180}
        minWidth={isSmallScreen ? "330px" : "400px"}
      >
        <Typography variant="h6" color="green" sx={{ mb: "10px" }}>
          Buying Recommendation
        </Typography>
        <div className="d-flex flex-column align-items-center">
          <Typography variant="caption" sx={{ color: "info.main" }}>
            {buyRecommendations.length > 0
              ? `You have ${buyRecommendations.length} stocks to buy.`
              : "No stocks to recommend yet."}
          </Typography>
          {buyingWarning.length > 0 && buyRecommendations.length === 0 && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <WarningIcon color="warning" />
              <Typography
                variant="variant"
                color="warning.main"
                ml={1}
                style={{
                  maxWidth: "340px",
                  marginBottom: "5px",
                  fontSize: "12px",
                }}
              >
                {buyingWarning[0]}
              </Typography>
            </Box>
          )}
          {buyRecommendations.length > 0 && (
            <FormControl
              variant="outlined"
              margin="normal"
              sx={{ minWidth: "200px", maxWidth: "300px" }}
            >
              <InputLabel id="sector-select-label">Select Sectors</InputLabel>
              <Select
                labelId="sector-select-label"
                id="sector-select"
                multiple
                value={selectedSectors}
                onChange={handleSectorChange}
                input={<OutlinedInput label="Select Sectors" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {sectors.map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    <Checkbox checked={selectedSectors.indexOf(sector) > -1} />
                    <ListItemText primary={sector} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleGenerateAdviceClick}
            size="small"
            sx={{
              color: "green",
              borderColor: "green",
              fontSize: "12px",
              padding: "4px 8px",
              mt: "8px",
              boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(0, 255, 0, 0.1)",
                borderColor: "darkgreen",
              },
              maxWidth: "200px",
            }}
            disabled={buyRecommendations.length === 0}
          >
            Generate Advice
          </Button>
        </div>
      </Box>

      <Dialog
        open={showAdviceDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="text-success">
          Buying Recommendations
        </DialogTitle>
        <DialogContent>
          {buyRecommendations.length > 0 ? (
            <Box>
              <Typography variant="body2">
                Total Buying Amount:
                <strong> {totalBuyingAmount.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" my={2}>
                Portfolio PE: <strong> {portfolioPE.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" my={2}>
                Portfolio Scope To Grow:{" "}
                <strong> {portfolioScopeToGrow.toFixed(2)}%</strong>
              </Typography>
              <RecommendationList recommendations={buyRecommendations} />
            </Box>
          ) : (
            <Typography>No recommendations available.</Typography>
          )}
          {buyingWarning.length > 0 && (
            <Box className="warning-box">
              <WarningIcon color="error" />
              <Typography color="error">{buyingWarning.join(". ")}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        open={confirmationDialogOpen}
        handleCloseConfirmation={handleCloseConfirmation}
        handleConfirmGenerateAdvice={handleConfirmGenerateAdvice}
      />
    </Box>
  );
};

export default BuyingAdvice;
