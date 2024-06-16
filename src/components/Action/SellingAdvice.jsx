import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useData } from "../dataprovider/DataProvider";
import ConfirmationDialog from "./ConfirmationDialog";

const SellingAdvice = () => {
  const [showAdviceDialog, setShowAdviceDialog] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const {
    sellingRecommendations,
    generateSellingAdvice,
    numberOfStocksToSell,
  } = useData();

  const handleGenerateAdviceClick = () => {
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };

  const handleConfirmGenerateAdvice = () => {
    generateSellingAdvice(); // Ensure recommendations are up-to-date
    setShowAdviceDialog(true);
    handleCloseConfirmation(); // Close confirmation dialog after confirming
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
      marginTop={2}
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
        mb={3}
        minHeight={180}
        sx={{
          position: "relative",
          "&:after":
            numberOfStocksToSell > 0
              ? {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "8px",
                  boxShadow: "0 0 10px red",
                  zIndex: -1,
                }
              : {},
        }}
      >
        <Typography variant="h6" color="red" sx={{ fontWeight: "bold" }}>
          Selling Recommendation
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <Typography variant="body1">
            {sellingRecommendations.length > 0
              ? "We have identified stocks that you might want to consider selling."
              : "None of your stocks meet the criteria for selling."}
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
              marginTop: "8px",
              boxShadow: "0px 0px 10px rgba(255, 0, 0, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)", // light red background on hover
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
            <Box display="flex" alignItems="center" mb={1}>
              <WarningIcon color="warning" />
              <Typography variant="body1" color="warning.main" ml={1}>
                No stocks currently meet the criteria for selling. Please check
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
