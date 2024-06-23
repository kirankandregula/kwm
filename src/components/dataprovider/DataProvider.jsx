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
import { useNavigate } from "react-router-dom";

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
  const [userPortfolioPresentValue, setUserPortfolioPresentValue] = useState(0);
  const [cookies, removeCookie] = useCookies(["userId"]);
  const navigate = useNavigate();
  const [sectors, setSectors] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [userHistoryData, setUserHistoryData] = useState([]);
  const [portfolioScopeToGrow, setPortfolioScopeToGrow] = useState(0);

  const fetchData = useFetchData(
    setFinancialData,
    setStockData,
    setIndividualStockData,
    setStockInRadarData,
    setEtfServiceData,
    setHistoryData,
    setLoading
  );

  // Memoize calculatePortfolioPE to ensure it doesn't change on every render
  const calculatePortfolioPEAndScopeToGrow = useCallback(() => {
    const totalValue = userStocks.reduce((acc, stock) => {
      return acc + stock.quantity * stock.LTP;
    }, 0);

    const weightedPETotal = userStocks.reduce((acc, stock) => {
      return acc + stock.quantity * stock.LTP * stock.pe;
    }, 0);

    const weightedScopeToGrowTotal = userStocks.reduce((acc, stock) => {
      return (
        acc +
        stock.quantity *
          stock.LTP *
          parseInt(stock.scopeToGrow.replace("%", ""))
      );
    }, 0);

    const portfolioPE = totalValue === 0 ? 0 : weightedPETotal / totalValue;
    const portfolioScopeToGrow =
      totalValue === 0 ? 0 : weightedScopeToGrowTotal / totalValue;

    return { portfolioPE, portfolioScopeToGrow };
  }, [userStocks]);

  const { calculateTotalAmount } = useTotalPortfolioValue(
    individualStockData,
    financialData
  );

  useEffect(() => {
    const { totalPortfolioValue } = calculateTotalAmount(
      userStocks,
      cookies.userId
    );

    setUserPortfolioPresentValue(totalPortfolioValue);
  }, [
    individualStockData,
    financialData,
    userStocks,
    cookies.userId,
    calculateTotalAmount,
  ]);

  useEffect(() => {
    if (stocksToConsider.length > 0) {
      const uniqueSectors = [
        ...new Set(
          stocksToConsider
            .filter(
              (stock) =>
                !userStocks.some(
                  (userStock) => userStock.Sector === stock.Sector
                )
            )
            .map((stock) => stock.Sector)
        ),
      ];
      setSectors(uniqueSectors);
    }
  }, [stocksToConsider, userStocks]);

  // Update userStocks when stockData or individualStockData changes
  useEffect(() => {
    if (stockData.length > 0 && individualStockData.length > 0) {
      const filteredUserStocks = stockData
        .filter((stock) => stock.user_id === cookies.userId)
        .map((stock) => {
          const stockDetails = individualStockData.find(
            (s) => s.stock_id === stock.stock_id
          );
          return stockDetails ? { ...stock, ...stockDetails } : null;
        })
        .filter((stock) => stock); // Filter out null values
      setUserStocks(filteredUserStocks);
    }
  }, [stockData, individualStockData, cookies.userId]);

  // Update userFinancialData when financialData changes
  useEffect(() => {
    if (financialData.length > 0) {
      const filteredUserFinancialData = financialData.find(
        (data) => data.user_id === cookies.userId
      );
      setUserFinancialData(filteredUserFinancialData || null);
    }
  }, [financialData, cookies.userId]);

  // Update userHistoryData when historyData changes
  useEffect(() => {
    if (historyData.length > 0) {
      const filteredUserHistoryData = historyData.filter(
        (data) => data.user_id === cookies.userId
      );
      setUserHistoryData(filteredUserHistoryData || []);
    }
  }, [historyData, cookies.userId]);

  useEffect(() => {
    if (userStocks.length > 0) {
      const { portfolioPE, portfolioScopeToGrow } =
        calculatePortfolioPEAndScopeToGrow();
      setPortfolioPE(portfolioPE);
      setPortfolioScopeToGrow(portfolioScopeToGrow); // New state variable to store portfolio ScopeToGrow
    }
  }, [userStocks, calculatePortfolioPEAndScopeToGrow]);

  const { generateBuyingAdvice, generateSellingAdvice } = useRecommendations(
    userFinancialData,
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
    setPortfolioPE,
    sectors,
    selectedSectors,
    portfolioScopeToGrow,
    setPortfolioScopeToGrow
  );

  const { processStockData } = useProcessStockData(
    individualStockData,
    useCallback((stocks) => setStocksToConsider(stocks), []),
    stockInRadarData
  );

  // Generate advice when userId and financialData are available
  useEffect(() => {
    if (cookies.userId && financialData.length > 0) {
      generateSellingAdvice();
      generateBuyingAdvice(selectedSectors);
    }
  }, [
    cookies.userId,
    financialData,
    generateSellingAdvice,
    generateBuyingAdvice,
    selectedSectors,
  ]);

  // Process stock data when stockInRadarData or individualStockData changes
  useEffect(() => {
    processStockData();
  }, [stockInRadarData, individualStockData, processStockData]);

  const resetNotificationCount = useCallback(() => {
    setNotifications([]);
    setBuyRecommendations([]);
    setSellingRecommendations([]);
    setSelectedSectors([]);
  }, []);

  const handleLogout = useCallback(() => {
    removeCookie("userId");
    removeCookie("userName"); // Clear the user ID cookie
    removeCookie("userRole");
    resetNotificationCount(); // Reset notifications and recommendations
    navigate("/login"); // Navigate to login page
  }, [removeCookie, resetNotificationCount, navigate]);

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
        userPortfolioPresentValue, // Add this to the context value
        fetchData,
        handleLogout,
        sectors,
        setSelectedSectors,
        selectedSectors,
        userHistoryData, // Add this to the context value,
        portfolioScopeToGrow,
        setBuyingWarning,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
