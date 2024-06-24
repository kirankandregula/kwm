import { useCallback, useMemo, useState } from "react";

export const useRecommendations = (
  userFinancialData,
  userStocks,
  individualStockData,
  userId,
  calculateTotalAmount,
  setBuyRecommendations,
  setSellingRecommendations,
  stocksToConsider,
  setBuyingWarning,
  portfolioPE,
  setPortfolioPE,
  sectors,
  selectedSectors,
  portfolioScopeToGrow,
  setPortfolioScopeToGrow
) => {
  const [previousRecommendations, setPreviousRecommendations] = useState([]);

  const generateBuyingAdvice = useCallback(
    (selectedSectors) => {
      const isNewUser = userStocks.length === 0;
      let newPortfolioScopeToGrow = portfolioScopeToGrow;
      const { totalPortfolioValue, liquidFunds } = calculateTotalAmount(
        userStocks,
        userId
      );

      // Check if user is approved
      if (!userFinancialData || userFinancialData.approved !== "yes") {
        setBuyingWarning([
          "Your account is not approved. Please contact the Admin to generate advices.",
        ]);
        setBuyRecommendations([]);
        return;
      }

      const sectorFilteredRecommendations = selectedSectors.length
        ? stocksToConsider.filter(
            (stock) =>
              selectedSectors.includes(stock.Sector) &&
              !userStocks.some(
                (userStock) => userStock.stock_id === stock.stock_id
              )
          )
        : [];

      const nonSectorFilteredRecommendations = stocksToConsider.filter(
        (stock) =>
          !userStocks.some(
            (userStock) => userStock.stock_id === stock.stock_id
          ) && !selectedSectors.includes(stock.Sector)
      );

      nonSectorFilteredRecommendations.sort(
        (a, b) =>
          parseInt(b.scopeToGrow.replace("%", "")) -
          parseInt(a.scopeToGrow.replace("%", ""))
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
          `You need at least ${allocatedAmountToEachStock.toFixed(
            2
          )}, but you only have ${liquidFunds.toFixed(2)}.`,
        ]);
        return;
      }

      const newRecommendations = [];
      const newWarnings = [];
      let remainingFunds = liquidFunds;
      let newPortfolioPE = portfolioPE;
      const includedSectors = new Set();

      sectorFilteredRecommendations.forEach((stock) => {
        if (
          !includedSectors.has(stock.Sector) &&
          remainingFunds >= allocatedAmountToEachStock
        ) {
          const buyQuantity = Math.floor(
            allocatedAmountToEachStock / stock.LTP
          );
          const totalCost = buyQuantity * stock.LTP;
          const stockPE = stock.pe;
          const updatedPortfolioPE =
            (newPortfolioPE * totalPortfolioValue + stockPE * totalCost) /
            (totalPortfolioValue + totalCost);
          const stockScopeToGrow = parseInt(stock.scopeToGrow.replace("%", ""));
          const updatedPortfolioScopeToGrow =
            (newPortfolioScopeToGrow * totalPortfolioValue +
              stockScopeToGrow * totalCost) /
            (totalPortfolioValue + totalCost);

          if (updatedPortfolioPE < 40) {
            remainingFunds -= totalCost;
            newPortfolioPE = updatedPortfolioPE;
            newPortfolioScopeToGrow = updatedPortfolioScopeToGrow;
            includedSectors.add(stock.Sector);
            newRecommendations.push({
              stockName: stock.stockName,
              LTP: stock.LTP,
              PE: stock.pe,
              TotalValue: totalCost,
              sector: stock.Sector,
              buyQuantity,
              scopeToGrow: stock.scopeToGrow,
            });
          } else {
            newWarnings.push(
              `Buying ${stock.stockName} would exceed the portfolio PE limit of 40. Consider adjusting your selections.`
            );
          }
        }
      });

      nonSectorFilteredRecommendations.forEach((stock) => {
        if (
          newRecommendations.length < remainingStocksToRecommend &&
          remainingFunds >= allocatedAmountToEachStock
        ) {
          const buyQuantity = Math.floor(
            allocatedAmountToEachStock / stock.LTP
          );
          const totalCost = buyQuantity * stock.LTP;
          const stockPE = stock.pe;
          const updatedPortfolioPE =
            (newPortfolioPE * totalPortfolioValue + stockPE * totalCost) /
            (totalPortfolioValue + totalCost);
          const stockScopeToGrow = parseInt(stock.scopeToGrow.replace("%", ""));
          const updatedPortfolioScopeToGrow =
            (newPortfolioScopeToGrow * totalPortfolioValue +
              stockScopeToGrow * totalCost) /
            (totalPortfolioValue + totalCost);

          if (updatedPortfolioPE < 40) {
            remainingFunds -= totalCost;
            newPortfolioPE = updatedPortfolioPE;
            newPortfolioScopeToGrow = updatedPortfolioScopeToGrow;
            newRecommendations.push({
              stockName: stock.stockName,
              LTP: stock.LTP,
              PE: stock.pe,
              TotalValue: totalCost,
              sector: stock.Sector,
              buyQuantity,
              scopeToGrow: stock.scopeToGrow,
            });
          } else {
            newWarnings.push(
              `Buying ${stock.stockName} would exceed the portfolio PE limit of 40. Consider adjusting your selections.`
            );
          }
        }
      });

      if (isNewUser || newRecommendations.length > 0) {
        if (
          JSON.stringify(previousRecommendations) !==
          JSON.stringify(newRecommendations)
        ) {
          setPreviousRecommendations(newRecommendations);
          setBuyRecommendations(newRecommendations);
          setPortfolioPE(newPortfolioPE);
          setPortfolioScopeToGrow(newPortfolioScopeToGrow);
        }
      } else {
        newWarnings.push(
          `You need ${allocatedAmountToEachStock - liquidFunds} more to buy stocks`
        );
      }

      setBuyingWarning(newWarnings);
    },
    [
      stocksToConsider,
      userStocks,
      calculateTotalAmount,
      setBuyRecommendations,
      setBuyingWarning,
      portfolioPE,
      setPortfolioPE,
      portfolioScopeToGrow,
      setPortfolioScopeToGrow,
      userId,
      previousRecommendations,
      setPreviousRecommendations,
      userFinancialData,
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
      sectors,
    }),
    [generateBuyingAdvice, generateSellingAdvice, sectors]
  );
};
