import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useCookies } from "react-cookie";
import { useFetchData } from "./useFetchData";
import { useTotalPortfolioValue } from "./useTotalPortfolioValue";
import { useRecommendations } from "./useRecommendations";
import { useProcessStockData } from "./useProcessStockData";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [financialData, setFinancialData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [individualStockData, setIndividualStockData] = useState([]);
  const [stockInRadarData, setStockInRadarData] = useState([]);
  const [etfServiceData, setEtfServiceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [buyRecommendations, setBuyRecommendations] = useState([]);
  const [sellingRecommendations, setSellingRecommendations] = useState([]);
  const [userStocks, setUserStocks] = useState([]);
  const [stocksToConsider, setStocksToConsider] = useState([]);
  const [buyingWarning, setBuyingWarning] = useState([]);
  const [userFinancialData, setUserFinancialData] = useState(null);
  const [portfolioPE, setPortfolioPE] = useState(0);
  const [cookies] = useCookies(["userId"]);

  const fetchData = useFetchData(
    setFinancialData,
    setStockData,
    setIndividualStockData,
    setStockInRadarData,
    setEtfServiceData,
    setLoading
  );

  useEffect(() => {
    if (stockData.length > 0 && individualStockData.length > 0) {
      const filteredUserStocks = stockData
        .filter((stock) => stock.user_id === cookies.userId)
        .map((stock) => {
          const stockDetails = individualStockData.find(
            (s) => s.stock_id === stock.stock_id
          );
          return {
            ...stock,
            ...stockDetails,
          };
        })
        .filter((stock) => stock.stock_id); // Filter out undefined stock details
      setUserStocks(filteredUserStocks);
    }
  }, [stockData, individualStockData, cookies.userId]);

  useEffect(() => {
    if (financialData.length > 0) {
      const filteredUserFinancialData = financialData.find(
        (data) => data.user_id === cookies.userId
      );
      setUserFinancialData(filteredUserFinancialData);
    }
  }, [financialData, cookies.userId]);

  const { calculateTotalAmount } = useTotalPortfolioValue(
    individualStockData,
    financialData
  );

  const calculatePortfolioPE = useCallback(() => {
    const totalValue = userStocks.reduce((acc, stock) => {
      return acc + stock.quantity * stock.LTP;
    }, 0);

    const weightedPETotal = userStocks.reduce((acc, stock) => {
      return acc + stock.quantity * stock.LTP * stock.pe;
    }, 0);

    return totalValue === 0 ? 0 : weightedPETotal / totalValue;
  }, [userStocks]);

  useEffect(() => {
    if (userStocks.length > 0) {
      setPortfolioPE(calculatePortfolioPE());
    }
  }, [userStocks, calculatePortfolioPE]);

  const { generateBuyingAdvice, generateSellingAdvice } = useRecommendations(
    financialData,
    userStocks,
    individualStockData,
    cookies.userId,
    calculateTotalAmount,
    useCallback(
      (recommendations) => setBuyRecommendations(recommendations),
      []
    ),
    useCallback(
      (recommendations) => setSellingRecommendations(recommendations),
      []
    ),
    stocksToConsider,
    useCallback((warning) => setBuyingWarning(warning), []),
    portfolioPE,
    setPortfolioPE
  );

  const { processStockData } = useProcessStockData(
    individualStockData,
    useCallback((stocks) => setStocksToConsider(stocks), []),
    stockInRadarData
  );

  useEffect(() => {
    if (financialData.length > 0) {
      generateSellingAdvice();
      generateBuyingAdvice();
    }
  }, [financialData, generateSellingAdvice, generateBuyingAdvice]);

  useEffect(() => {
    processStockData();
  }, [stockInRadarData, individualStockData, processStockData]);

  const resetNotificationCount = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <DataContext.Provider
      value={{
        financialData,
        stockData,
        individualStockData,
        stockInRadarData,
        etfServiceData,
        userStocks,
        userFinancialData,
        notifications,
        loading,
        setLoading,
        buyRecommendations,
        buyingWarning,
        sellingRecommendations,
        generateBuyingAdvice,
        generateSellingAdvice,
        resetNotificationCount,
        setBuyRecommendations,
        setSellingRecommendations,
        portfolioPE,
        fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
