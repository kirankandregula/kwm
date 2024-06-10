import React from "react";
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
import { useData } from "../DataProvider";

const SellingAdvice = () => {
  const [showAdviceDialog, setShowAdviceDialog] = React.useState(false);
  const { userStocks, sellingRecommendations, generateSellingAdvice } =
    useData();

  const userHasStocks = userStocks.length > 0;

  const handleGenerateAdviceClick = () => {
    generateSellingAdvice(); // Ensure recommendations are up-to-date
    setShowAdviceDialog(true);
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
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
        mb={3}
      >
        <Typography variant="h6" color="red">
          Selling Recommendation
        </Typography>
        <Typography variant="body1">
          {userHasStocks
            ? "Check if you have stocks to sell."
            : "You don't have stocks to sell."}
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
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)", // light red background on hover
              borderColor: "darkred",
            },
          }}
          disabled={!userHasStocks}
        >
          Generate Advice
        </Button>
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
                      Stock: {rec.stockName}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">Price: {rec.price}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1" color="secondary">
                      {rec.scopeToGrow <= 5 || rec.action === "Sell"
                        ? "Sell"
                        : "Ready to Sell"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))
          ) : (
            <Box display="flex" alignItems="center" mb={1}>
              <WarningIcon color="warning" />
              <Typography variant="body1" color="warning.main" ml={1}>
                No stocks meet the criteria for selling.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SellingAdvice;
