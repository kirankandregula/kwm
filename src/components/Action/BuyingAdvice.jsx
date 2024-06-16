import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import RecommendationList from "./RecommendationList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WarningIcon from "@mui/icons-material/Warning";
import { useTheme } from "@mui/material/styles";
import ConfirmationDialog from "./ConfirmationDialog";
import { useData } from "../dataprovider/DataProvider";

const BuyingAdvice = () => {
  const { buyRecommendations, buyingWarning, userFinancialData, portfolioPE } =
    useData();
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
      marginTop={5}
      flexDirection={isSmallScreen ? "column" : "row"}
      alignItems={isSmallScreen ? "center" : "flex-start"}
    >
      <Box
        className="initial-recommendation"
        textAlign="center"
        padding="24px"
        border="1px solid #ccc"
        borderRadius="8px"
        backgroundColor="#f9f9f9"
        width={380}
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
        minHeight={180}
        marginTop={3}
      >
        <Typography
          variant="h6"
          color="green"
          sx={{ fontWeight: "bold", mb: "10px" }}
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
          <Typography variant="body1">
            {buyRecommendations.length > 0
              ? `You have ${buyRecommendations.length} stocks to buy.`
              : "No stocks to recommend yet."}
          </Typography>
          {buyRecommendations.length === 0 && buyingWarning.length > 0 && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <WarningIcon color="error" />
              <Typography variant="body1" color="error" ml={1}>
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
                width: "200px",
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
        <DialogTitle>Buying Advice</DialogTitle>
        <DialogContent>
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
