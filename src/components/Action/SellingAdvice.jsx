import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useData } from "../dataprovider/DataProvider";
import ConfirmationDialog from "./ConfirmationDialog";

const SellingAdvice = () => {
  const [showAdviceDialog, setShowAdviceDialog] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const { sellingRecommendations, generateSellingAdvice } = useData();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleGenerateAdviceClick = () => {
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };

  const handleConfirmGenerateAdvice = () => {
    generateSellingAdvice();
    setShowAdviceDialog(true);
    handleCloseConfirmation();
  };

  const handleCloseDialog = () => {
    setShowAdviceDialog(false);
  };

  return (
    <Box
      className="selling-advice-container"
      display="flex"
      justifyContent="center"
      padding="0 16px"
      flexDirection="column"
      alignItems="center"
      mb={3}
      mt={1}
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
        <Typography variant="h6" color="red">
          Selling Recommendation
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: "20px",
          }}
        >
          <Typography variant="caption" sx={{mb: "8px", color: "warning.main"}} >
            {sellingRecommendations.length > 0
              ? `${sellingRecommendations.length} Stocks to consider selling.`
              : "None of your stocks met the criteria for selling."}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleGenerateAdviceClick}
            size="small"
            sx={{
              color: "red",
              borderColor: "red",
              fontSize: "12px",
              padding: "4px 8px",
              mt: "8px",
              boxShadow: "0px 0px 10px rgba(255, 0, 0, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                borderColor: "darkred",
              },
            }}
            disabled={sellingRecommendations.length === 0}
          >
            Generate Advice
          </Button>
        </Box>

        {sellingRecommendations.length > 0 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <WarningIcon color="error" />
            <Typography variant="body1" color="error" ml={1}>
              {`You have ${sellingRecommendations.length} stock${
                sellingRecommendations.length > 1 ? "s" : ""
              } to consider for selling.`}
            </Typography>
          </Box>
        )}
      </Box>

      <Dialog
        open={showAdviceDialog}
        onClose={handleCloseDialog}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>Selling Advice</DialogTitle>
        <DialogContent>
          {sellingRecommendations.length > 0 ? (
            sellingRecommendations.map((rec, index) => (
              <Box key={index} p={2} border={1} borderRadius={2} mb={1}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Stock:</strong> {rec.stockName}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">
                      <strong>Price:</strong> {rec.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="body1"
                      color={
                        rec.scopeToGrow <= 5 || rec.action === "Sell"
                          ? "error"
                          : "primary"
                      }
                    >
                      {rec.scopeToGrow <= 5 || rec.action === "Sell"
                        ? "Sell Now"
                        : "Hold"}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" mt={1}>
                  {rec.scopeToGrow <= 5 || rec.action === "Sell"
                    ? "This stock has limited growth potential and is recommended for immediate selling."
                    : "This stock is nearing the target price but has some potential left for growth."}
                </Typography>
              </Box>
            ))
          ) : (
            <Box display="flex" flexDirection="column" justifyContent="end" alignItems="center" mb={1}>
              <WarningIcon color="warning" />
              <Typography variant="caption" color="warning.main" ml={1}>
                No stocks currently met the criteria for selling. Please check
                back later.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        confirmationOpen={confirmationOpen}
        handleCloseConfirmation={handleCloseConfirmation}
        handleConfirmGenerateAdvice={handleConfirmGenerateAdvice}
      />
    </Box>
  );
};

export default SellingAdvice;
