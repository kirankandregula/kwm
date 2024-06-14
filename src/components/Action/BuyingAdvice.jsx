import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Typography,
  useMediaQuery,
} from "@mui/material";
import RecommendationList from "./RecommendationList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WarningIcon from "@mui/icons-material/Warning";
import { useTheme } from "@mui/material/styles";
import BuyAdviceDialog from "./BuyAdviceDialog";
import { useData } from "../dataprovider/DataProvider";

const BuyingAdvice = () => {
  const {
    buyRecommendations,
    buyingWarning,
    userFinancialData,
    portfolioPE,
  } = useData();
  const [showAdviceDialog, setShowAdviceDialog] = useState(false);
  const [peFilterEnabled, setPeFilterEnabled] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [totalBuyingAmount, setTotalBuyingAmount] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCloseDialog = () => {
    setShowAdviceDialog(false);
    setShowRecommendations(false);
  };

  const handlePeFilterChange = (event) => {
    setPeFilterEnabled(event.target.checked);
  };

  const handleGenerateAdviceClick = () => {
    const liquidFunds = userFinancialData ? userFinancialData.Debt : 0;
    const requiredAmount = 25000 - liquidFunds;

    if (requiredAmount > 0) {
      alert(`${buyingWarning[0]}`);
      return;
    }

    setShowRecommendations(true);
    setShowAdviceDialog(true);
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

  const handleConfirmDialogClose = () => {
    setConfirmationDialogOpen(false);
  };

  return (
    <Box
      className="buying-advice-container"
      display="flex"
      justifyContent="center"
      padding="0 16px"
      flexDirection={isSmallScreen ? "column" : "row"}
      alignItems={isSmallScreen ? "center" : "flex-start"}
    >
      {showRecommendations ? (
        <Box flex="1" maxWidth={isSmallScreen ? "100%" : "60%"} marginLeft={isSmallScreen ? "0" : "16px"}>
          <RecommendationList
            buyRecommendations={buyRecommendations}
            portfolioPE={portfolioPE}
            totalBuyingAmount={totalBuyingAmount}
          />
        </Box>
      ) : (
        <Box
          className="initial-recommendation"
          textAlign="center"
          padding="24px"
          border="1px solid #ccc"
          borderRadius="8px"
          backgroundColor="#f9f9f9"
          width={400}
          boxShadow= "0px 0px 10px rgba(0, 0, 0, 0.2)"
          marginTop={2}
        >
          <Typography variant="h6" color="green">
            Buying Recommendation
          </Typography>
          <Typography variant="body1">
            {buyRecommendations.length > 0
              ? `You have ${buyRecommendations.length} stocks to buy.`
              : "No stocks to recommend yet."}
          </Typography>
          {buyRecommendations.length === 0 && buyingWarning.length > 0 && (
            <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
              <WarningIcon color="error" />
              <Typography variant="body1" color="error" ml={1}>
                {buyingWarning[0]}
              </Typography>
            </Box>
          )}
          {userFinancialData && userFinancialData.Debt >= 25000 && (
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
      )}
      <Dialog
        open={showAdviceDialog}
        onClose={handleCloseDialog}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>Buying Advice</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={peFilterEnabled}
                onChange={handlePeFilterChange}
                name="peFilter"
                color="primary"
              />
            }
            label="Apply PE Filter"
          />
          <RecommendationList
            buyRecommendations={buyRecommendations}
            portfolioPE={portfolioPE}
            totalBuyingAmount={totalBuyingAmount}
          />
        </DialogContent>
      </Dialog>
      <BuyAdviceDialog
        open={confirmationDialogOpen}
        handleClose={handleConfirmDialogClose}
      />
    </Box>
  );
};

export default BuyingAdvice;
