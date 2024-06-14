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
  setPortfolioPE,
  sectorAllocation
) => {
  const generateBuyingAdvice = useCallback(() => {
    const isNewUser = userStocks.length === 0;
    const { totalPortfolioValue, liquidFunds } = calculateTotalAmount(
      userStocks,
      userId
    );

    const recommendations = stocksToConsider.filter((stock) => {
      const isNotOwned = !userStocks.some(
        (userStock) => userStock.stock_id === stock.stock_id
      );
      return isNotOwned;
    });

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

    const newRecommendations = [];
    let remainingFunds = liquidFunds;
    let newPortfolioPE = portfolioPE;
    let newSectorAllocation = { ...sectorAllocation };

    for (
      let i = 0;
      i < recommendations.length &&
      newRecommendations.length < remainingStocksToRecommend;
      i++
    ) {
      const stock = recommendations[i];
      const buyQuantity = Math.floor(allocatedAmountToEachStock / stock.LTP);
      const totalCost = buyQuantity * stock.LTP;
      const stockPE = stock.pe;
      const sector = stock.Sector;
      const updatedPortfolioPE =
        (newPortfolioPE * totalPortfolioValue + stockPE * totalCost) /
        (totalPortfolioValue + totalCost);
      const updatedSectorAllocation =
        (newSectorAllocation[sector] || 0) +
        (totalCost / totalPortfolioValue) * 100;

      if (
        remainingFunds >= totalCost &&
        updatedPortfolioPE < 50 &&
        updatedSectorAllocation <= 20
      ) {
        remainingFunds -= totalCost;
        newPortfolioPE = updatedPortfolioPE;
        newSectorAllocation[sector] = updatedSectorAllocation;
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
        `You need ${allocatedAmount - liquidFunds} more to buy stocks`,
      ]);
    }
  }, [
    stocksToConsider,
    userStocks,
    calculateTotalAmount,
    setBuyRecommendations,
    setBuyingWarning,
    portfolioPE,
    setPortfolioPE,
    sectorAllocation,
    userId,
  ]);

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
