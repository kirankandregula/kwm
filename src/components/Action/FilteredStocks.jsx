import { useEffect, useCallback } from "react";

const FilteredStocks = ({
  userStocks,
  individualStockData,
  setFilteredStocks,
}) => {
  const filterAndSortStocks = useCallback(() => {
    const userStockIds = userStocks.map((stock) => stock.stock_id);
    const sortedStocks = individualStockData
      .filter(
        (stock) => !userStockIds.includes(stock.stock_id) && stock.scopeToGrow
      )
      .sort(
        (a, b) =>
          parseFloat(b.scopeToGrow.replace("%", "")) -
          parseFloat(a.scopeToGrow.replace("%", ""))
      );
    setFilteredStocks(sortedStocks);
  }, [userStocks, individualStockData, setFilteredStocks]);

  useEffect(() => {
    filterAndSortStocks();
  }, [userStocks, individualStockData, filterAndSortStocks]);

  return null;
};

export default FilteredStocks;
