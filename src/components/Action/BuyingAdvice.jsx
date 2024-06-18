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
    userFinancialData,
    portfolioPE,
    sectors, // Get the sectors from the DataProvider
    generateBuyingAdvice,
    setSelectedSectors,
    selectedSectors,
  } = useData();
  const [showAdviceDialog, setShowAdviceDialog] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [totalBuyingAmount, setTotalBuyingAmount] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCloseDialog = () => {
    setShowAdviceDialog(false);
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
    generateBuyingAdvice(selectedSectors); // Ensure advice is generated after confirmation
  };

  const handleSectorChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedSectors(selectedValues);

    generateBuyingAdvice(selectedValues); // Generate advice when sectors are changed
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
        minWidth={isSmallScreen? "330px" : "400px"}
      >
        <Typography
          variant="h6"
          color="green"
          sx={{ mb: "10px" }}
        >
          Buying Recommendation
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100px",
          }}
        >
          <Typography variant="caption" sx={{color: "warning.main"}}>
            {buyRecommendations.length > 0
              ? `You have ${buyRecommendations.length} stocks to buy.`
              : "No stocks to recommend yet."}
          </Typography>
          { buyingWarning.length > 0 && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <WarningIcon color="error" />
              <Typography variant="variant" color="error" ml={1} style={{maxWidth: "340px", marginBottom: "5px",fontSize: "12px"}}>
                {buyingWarning[0]}
              </Typography>
            </Box>
          )}
          {userFinancialData && (
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
                marginTop: "8px",
                boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(0, 255, 0, 0.1)",
                  borderColor: "darkgreen",
                },
              }}
              disabled={buyRecommendations.length === 0}
            >
              Generate Advice
            </Button>
          )}
        </Box>
      </Box>

      <Dialog
        open={showAdviceDialog}
        onClose={handleCloseDialog}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle className="text-primary">Buying Advice</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel
              htmlFor="outlined-adornment-sectors"
              shrink={selectedSectors.length > 0}
            >
              Sectors
            </InputLabel>
            <Select
              id="outlined-adornment-sectors"
              multiple
              value={selectedSectors}
              onChange={handleSectorChange}
              renderValue={(selected) => selected.join(", ")}
              label="Sectors"
            >
              {sectors.map((sector) => (
                <MenuItem key={sector} value={sector}>
                  <Checkbox checked={selectedSectors.indexOf(sector) > -1} />
                  <ListItemText primary={sector} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <RecommendationList
            buyRecommendations={buyRecommendations}
            portfolioPE={portfolioPE}
            totalBuyingAmount={totalBuyingAmount}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        confirmationOpen={confirmationDialogOpen}
        handleCloseConfirmation={handleCloseConfirmation}
        handleConfirmGenerateAdvice={handleConfirmGenerateAdvice}
      />
    </Box>
  );
};

export default BuyingAdvice;
