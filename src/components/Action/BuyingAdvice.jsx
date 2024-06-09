import React, { useState, useEffect, useCallback } from "react";
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
import FilteredStocks from "./FilteredStocks";
import RecommendationList from "./RecommendationList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import BuyAdviceDialog from "./BuyAdviceDialog";

const BuyingAdvice = ({
  userFinancialData,
  userStocks,
  individualStockData,
}) => {
  const [buyRecommendations, setBuyRecommendations] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [showAdviceDialog, setShowAdviceDialog] = useState(false);
  const [totalBuyingAmount, setTotalBuyingAmount] = useState(0);
  const [averagePe, setAveragePe] = useState(0);
  const [adviceGenerated, setAdviceGenerated] = useState(false);
  const [peFilterEnabled, setPeFilterEnabled] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const calculateTotalAmountAndAveragePe = useCallback((recommendations) => {
    const totalAmount = recommendations.reduce(
      (acc, rec) => acc + rec.totalValue,
      0
    );
    const totalPe = recommendations.reduce(
      (acc, rec) => acc + rec.pe * rec.totalValue,
      0
    );
    const averagePe = totalAmount ? totalPe / totalAmount : 0;
    setTotalBuyingAmount(totalAmount);
    setAveragePe(averagePe);
  }, []);

  const calculatePortfolioPE = useCallback(() => {
    const totalValue = userStocks.reduce((acc, stock) => {
      const stockDetails = individualStockData.find(
        (s) => s.stock_id === stock.stock_id
      );
      if (!stockDetails) {
        console.warn(`No stock details found for stock_id: ${stock.stock_id}`);
        return acc;
      }
      return acc + stock.quantity * stockDetails.LTP;
    }, 0);
    const weightedPETotal = userStocks.reduce((acc, stock) => {
      const stockDetails = individualStockData.find(
        (s) => s.stock_id === stock.stock_id
      );
      if (!stockDetails) {
        return acc;
      }
      return acc + stock.quantity * stockDetails.LTP * stockDetails.pe;
    }, 0);
    return totalValue === 0 ? 0 : weightedPETotal / totalValue;
  }, [userStocks, individualStockData]);

  const generateBuyingAdvice = useCallback(() => {
    const { Debt: liquidFunds } = userFinancialData;
    const currentPortfolioValue = userStocks.reduce((acc, stock) => {
      const stockDetails = individualStockData.find(
        (s) => s.stock_id === stock.stock_id
      );
      if (!stockDetails) {
        return acc;
      }
      return acc + stock.quantity * stockDetails.LTP;
    }, 0);
    const currentNumberOfStocks = userStocks.length;

    let allocatedAmount = liquidFunds;
    let maxStocks;

    const totalFunds = currentPortfolioValue + liquidFunds;
    if (totalFunds <= 25000) {
      allocatedAmount = 25000 / 5;
      maxStocks = 5;
    } else if (totalFunds <= 50000) {
      allocatedAmount = totalFunds / 5;
      maxStocks = 5;
    } else if (totalFunds <= 70000) {
      allocatedAmount = totalFunds / 7;
      maxStocks = 7;
    } else if (totalFunds <= 105000) {
      allocatedAmount = 15000;
      maxStocks = 7;
    } else {
      allocatedAmount = totalFunds / 10;
      maxStocks = 10;
    }

    const remainingStocksToRecommend = maxStocks - currentNumberOfStocks;

    const userStockIds = userStocks.map((stock) => stock.stock_id);
    const stocksToConsider = filteredStocks.filter(
      (stock) => !userStockIds.includes(stock.stock_id)
    );

    const recommendations = getRecommendations(
      stocksToConsider,
      allocatedAmount,
      calculatePortfolioPE(),
      remainingStocksToRecommend,
      liquidFunds,
      peFilterEnabled
    );
    setBuyRecommendations(recommendations);
    calculateTotalAmountAndAveragePe(recommendations);
  }, [
    userFinancialData,
    userStocks,
    individualStockData,
    filteredStocks,
    peFilterEnabled,
    calculateTotalAmountAndAveragePe,
    calculatePortfolioPE, // Add calculatePortfolioPE as a dependency
  ]);

  const getRecommendations = (
    stocksToConsider,
    allocatedAmount,
    portfolioPE,
    maxStocks,
    liquidFunds,
    peFilterEnabled
  ) => {
    const recommendations = [];
    let totalValue = 0;

    for (const stock of stocksToConsider) {
      if (recommendations.length >= maxStocks) break;

      const quantity = Math.floor(allocatedAmount / stock.LTP);
      const stockValue = quantity * stock.LTP;
      const newPortfolioPE =
        (portfolioPE * totalValue + stock.pe * stockValue) /
        (totalValue + stockValue);

      if (
        stockValue <= allocatedAmount &&
        totalValue + stockValue <= liquidFunds &&
        (!peFilterEnabled || newPortfolioPE <= 40)
      ) {
        recommendations.push({
          stockName: stock.stockName,
          LTP: stock.LTP,
          quantity,
          totalValue: stockValue,
          pe: stock.pe,
        });
        totalValue += stockValue;
        portfolioPE = newPortfolioPE;
        allocatedAmount -= stockValue; // Deduct the allocated amount
      }
    }

    return recommendations;
  };

  const handleCloseDialog = () => {
    setShowAdviceDialog(false);
    setShowRecommendations(false); // Hide recommendations when dialog is closed
  };

  const handlePeFilterChange = (event) => {
    setPeFilterEnabled(event.target.checked);
  };

  const handleGenerateAdviceClick = () => {
    const { Debt: liquidFunds } = userFinancialData;
    const requiredAmount = 25000 - liquidFunds; // Assuming a minimum required amount of 25000

    if (requiredAmount > 0) {
      alert(`You need ₹${requiredAmount} more to buy stocks.`);
      return;
    }

    setAdviceGenerated(false);
    setShowRecommendations(true);
    setShowAdviceDialog(true);
  };

  useEffect(() => {
    if (!adviceGenerated && showRecommendations) {
      generateBuyingAdvice();
      setAdviceGenerated(true);
    }
  }, [showRecommendations, adviceGenerated, generateBuyingAdvice]);

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
        <>
          <FilteredStocks
            userStocks={userStocks}
            individualStockData={individualStockData}
            setFilteredStocks={setFilteredStocks}
          />
          <Box
            flex="1"
            maxWidth={isSmallScreen ? "100%" : "60%"}
            marginLeft={isSmallScreen ? "0" : "16px"}
          >
            <RecommendationList
              buyRecommendations={buyRecommendations}
              totalBuyingAmount={totalBuyingAmount}
              averagePe={averagePe}
            />
          </Box>
        </>
      ) : (
        <Box
          className="initial-recommendation"
          textAlign="center"
          padding="24px"
          border="1px solid #ccc"
          borderRadius="8px"
          backgroundColor="#f9f9f9"
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
        >
          <Typography variant="h6" color="green">
            Buying Recommendation
          </Typography>
          <Typography variant="body1">
            {buyRecommendations.length > 0
              ? `You have stocks to buy`
              : "No stocks to recommend yet."}
          </Typography>
          {userFinancialData.Debt >= 25000 && (
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}
              onClick={handleGenerateAdviceClick}
              sx={{
                backgroundColor: "green",
                color: "white",
                fontSize: "14px",
                padding: "8px 16px",
                marginTop: "8px",
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
              }}
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
            totalBuyingAmount={totalBuyingAmount}
            averagePe={averagePe}
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
