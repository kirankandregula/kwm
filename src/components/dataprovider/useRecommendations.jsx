import { useCallback, useMemo } from "react";

export const useRecommendations = (
  financialData,
  userStocks,
  individualStockData,
  userId,
  calculateTotalAmount,
  setBuyRecommendations,
  setSellingRecommendations,
  stocksToConsider,
  setBuyingWarning,
  portfolioPE,
  setPortfolioPE
) => {
  const generateBuyingAdvice = useCallback(
    (selectedSectors = []) => {
      const isNewUser = userStocks.length === 0;
      const { totalPortfolioValue, liquidFunds } = calculateTotalAmount(
        userStocks,
        userId
      );

      // Extract the sectors the user already has stocks in
      const userStockSectors = new Set(userStocks.map((stock) => stock.Sector));

      // Filter stocksToConsider by selectedSectors
      const filteredRecommendations = selectedSectors.length
        ? stocksToConsider.filter(
            (stock) =>
              selectedSectors.includes(stock.Sector) &&
              !userStocks.some(
                (userStock) => userStock.stock_id === stock.stock_id
              )
          )
        : stocksToConsider.filter(
            (stock) =>
              !userStocks.some(
                (userStock) => userStock.stock_id === stock.stock_id
              )
          );

      let allocatedAmount;
      let maxStocks;
      if (totalPortfolioValue <= 25000) {
        allocatedAmount = 25000 / 5;
        maxStocks = 5;
      } else if (totalPortfolioValue <= 50000) {
        allocatedAmount = totalPortfolioValue / 5;
        maxStocks = 5;
      } else if (totalPortfolioValue <= 60000) {
        allocatedAmount = totalPortfolioValue / 6;
        maxStocks = 6;
      } else if (totalPortfolioValue <= 70000) {
        allocatedAmount = totalPortfolioValue / 7;
        maxStocks = 7;
      } else if (totalPortfolioValue <= 150000) {
        allocatedAmount = 15000;
        maxStocks = 10;
      } else {
        allocatedAmount = totalPortfolioValue / 10;
        maxStocks = 10;
      }

      const allocatedAmountToEachStock = allocatedAmount;
      const remainingStocksToRecommend = maxStocks - userStocks.length;

      if (allocatedAmountToEachStock > liquidFunds) {
        setBuyingWarning([
          ` Minimum required is ${allocatedAmountToEachStock}, but you only have ${liquidFunds}.`,
        ]);
        return;
      }

      const newRecommendations = [];
      let remainingFunds = liquidFunds;
      let newPortfolioPE = portfolioPE;
      const includedSectors = new Set();

      for (
        let i = 0;
        i < filteredRecommendations.length &&
        newRecommendations.length < remainingStocksToRecommend;
        i++
      ) {
        const stock = filteredRecommendations[i];
        const sector = stock.Sector;

        if (includedSectors.has(sector) || userStockSectors.has(sector)) {
          continue; // Skip if sector is already included or user already has stocks in this sector
        }

        const buyQuantity = Math.floor(allocatedAmountToEachStock / stock.LTP);
        const totalCost = buyQuantity * stock.LTP;
        const stockPE = stock.pe;
        const updatedPortfolioPE =
          (newPortfolioPE * totalPortfolioValue + stockPE * totalCost) /
          (totalPortfolioValue + totalCost);

        if (remainingFunds >= totalCost && updatedPortfolioPE < 50) {
          remainingFunds -= totalCost;
          newPortfolioPE = updatedPortfolioPE;
          includedSectors.add(sector); // Mark sector as included
          newRecommendations.push({
            stockName: stock.stockName,
            LTP: stock.LTP,
            PE: stock.pe,
            TotalValue: buyQuantity * stock.LTP,
            buyQuantity,
          });
        } else {
          setBuyingWarning([
            `You need ${(totalCost - remainingFunds).toFixed(2)} more to buy ${
              stock.stockName
            }`,
          ]);
          break;
        }
      }

      if (isNewUser || newRecommendations.length > 0) {
        setBuyRecommendations(newRecommendations);
        setPortfolioPE(newPortfolioPE);
      } else {
        setBuyingWarning([
          `You need ${
            allocatedAmountToEachStock - liquidFunds
          } more to buy stocks`,
        ]);
      }
    },
    [
      stocksToConsider,
      userStocks,
      calculateTotalAmount,
      setBuyRecommendations,
      setBuyingWarning,
      portfolioPE,
      setPortfolioPE,
      userId,
    ]
  );

  const generateSellingAdvice = useCallback(() => {
    const sellingRecommendations = userStocks
      .map((stock) => {
        const stockDetails = individualStockData.find(
          (s) => s.stock_id === stock.stock_id
        );
        if (!stockDetails) {
          console.warn(
            `No stock details found for stock_id: ${stock.stock_id}`
          );
          return null;
        }
        return {
          stockName: stockDetails.stockName,
          price: stockDetails.LTP,
          scopeToGrow: parseInt(stockDetails.scopeToGrow.replace("%", "")),
          action: stockDetails.action,
        };
      })
      .filter(
        (stock) => stock && (stock.scopeToGrow <= 10 || stock.action === "Sell")
      );

    setSellingRecommendations(sellingRecommendations);
  }, [userStocks, individualStockData, setSellingRecommendations]);

  return useMemo(
    () => ({
      generateBuyingAdvice,
      generateSellingAdvice,
    }),
    [generateBuyingAdvice, generateSellingAdvice]
  );
};
