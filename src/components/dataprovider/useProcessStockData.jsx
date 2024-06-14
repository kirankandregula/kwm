import { useCallback } from "react";

export const useProcessStockData = (
  individualStockData,
  setStocksToConsider,
  stockInRadarData
) => {
  const processStockData = useCallback(() => {
    const combinedData = [...stockInRadarData, ...individualStockData];
    const uniqueData = [];
    const duplicates = [];

    combinedData.forEach((stock) => {
      if (uniqueData.find((item) => item.stockName === stock.stockName)) {
        duplicates.push(stock.stockName);
      } else {
        uniqueData.push(stock);
      }
    });

    const sorted = uniqueData.sort(
      (a, b) => parseFloat(b.scopeToGrow.replace("%", "")) - parseFloat(a.scopeToGrow.replace("%", ""))
    );

    setStocksToConsider(sorted);
    return sorted;
  }, [stockInRadarData, individualStockData, setStocksToConsider]);

  return { processStockData };
};
