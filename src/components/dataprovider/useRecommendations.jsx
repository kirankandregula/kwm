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
  sectors
) => {
  const [previousRecommendations, setPreviousRecommendations] = useState([]);

  const generateBuyingAdvice = useCallback(
    (selectedSectors) => {
      const isNewUser = userStocks.length === 0;
      const { totalPortfolioValue, liquidFunds } = calculateTotalAmount(
        userStocks,
        userId
      );

      // Check if user is approved
      if (!userFinancialData || userFinancialData.approved !== "yes") {
        setBuyingWarning([
          "Your account is not approved. Please contact the Admin to generate advices.",
        ]);
        return;
      }

      // Filter stocksToConsider by selectedSectors
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
          ) && !selectedSectors.includes(stock.Sector) // Ensure non-selected sectors
      );

      // Sort by scope to grow
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
        maxStocks = 11;
      }

      const allocatedAmountToEachStock = allocatedAmount;
      const remainingStocksToRecommend = maxStocks - userStocks.length;

      if (isNewUser && liquidFunds < 25000) {
        setBuyingWarning([
          `Minimum required is 25000, but you only have ${liquidFunds}.`,
        ]);
        return;
      }

      if (allocatedAmountToEachStock > liquidFunds) {
        setBuyingWarning([
          `Minimum required is ${allocatedAmountToEachStock}, but you only have ${liquidFunds}.`,
        ]);
        return;
      }

      const newRecommendations = [];
      let remainingFunds = liquidFunds;
      let newPortfolioPE = portfolioPE;
      const includedSectors = new Set();

      // Include one stock from each selected sector
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
          if (updatedPortfolioPE < 40) {
            remainingFunds -= totalCost;
            newPortfolioPE = updatedPortfolioPE;
            includedSectors.add(stock.Sector);
            newRecommendations.push({
              stockName: stock.stockName,
              LTP: stock.LTP,
              PE: stock.pe,
              TotalValue: totalCost,
              buyQuantity,
              scopeToGrow: stock.scopeToGrow,
              sector: stock.Sector,
            });
          }
        }
      });

      // Fill remaining recommendations based on the highest scope to grow, ensuring unique sectors
      nonSectorFilteredRecommendations.forEach((stock) => {
        if (
          newRecommendations.length < remainingStocksToRecommend &&
          remainingFunds >= allocatedAmountToEachStock &&
          !includedSectors.has(stock.Sector)
        ) {
          const buyQuantity = Math.floor(
            allocatedAmountToEachStock / stock.LTP
          );
          const totalCost = buyQuantity * stock.LTP;
          const stockPE = stock.pe;
          const updatedPortfolioPE =
            (newPortfolioPE * totalPortfolioValue + stockPE * totalCost) /
            (totalPortfolioValue + totalCost);

          if (updatedPortfolioPE < 40) {
            remainingFunds -= totalCost;
            newPortfolioPE = updatedPortfolioPE;
            includedSectors.add(stock.Sector);
            newRecommendations.push({
              stockName: stock.stockName,
              LTP: stock.LTP,
              PE: stock.pe,
              TotalValue: totalCost,
              buyQuantity,
              scopeToGrow: stock.scopeToGrow,
              sector: stock.Sector,
            });
          }
        }
      });

      const totalStocksAfterRecommendations = userStocks.length + newRecommendations.length;

      if (isNewUser || newRecommendations.length > 0) {
        // Only update recommendations if there are changes
        if (
          JSON.stringify(previousRecommendations) !==
          JSON.stringify(newRecommendations)
        ) {
          setPreviousRecommendations(newRecommendations);
          setBuyRecommendations(newRecommendations);
          setPortfolioPE(newPortfolioPE);

          if (totalStocksAfterRecommendations > 10) {
            setBuyingWarning([
              "Too many stocks, reduce to max 10.",
            ]);
          }
        }
      } else {
        setBuyingWarning([
          `Need ${allocatedAmountToEachStock - liquidFunds} more to buy stocks.`,
        ]);
      }
    },
    [
      userFinancialData,
      stocksToConsider,
      userStocks,
      calculateTotalAmount,
      setBuyRecommendations,
      setBuyingWarning,
      portfolioPE,
      setPortfolioPE,
      userId,
      previousRecommendations,
      setPreviousRecommendations,
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
