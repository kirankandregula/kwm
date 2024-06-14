import { useCallback } from "react";

export const useTotalPortfolioValue = (individualStockData, financialData) => {
  const calculateTotalAmount = useCallback((userStocks, userId) => {
    let totalAmount = 0;

    userStocks.forEach((userStock) => {
      const stockData = individualStockData.find(stock => stock.stock_id === userStock.stock_id);
      if (stockData && stockData.LTP) {
        totalAmount += userStock.quantity * stockData.LTP;
      } else {
        console.warn(`LTP not found for stock_id: ${userStock.stock_id}`);
      }
    });

    const userFinancialData = financialData.find(data => data.user_id === userId);
    const liquidFunds = userFinancialData ? userFinancialData["Debt"] : 0;

    const totalPortfolioValue = totalAmount + liquidFunds;

    return { totalPortfolioValue, liquidFunds };
  }, [individualStockData, financialData]);

  return { calculateTotalAmount };
};
