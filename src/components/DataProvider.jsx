import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [financialData, setFinancialData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [individualStockData, setIndividualStockData] = useState([]);
  const [stockInRadarData, setStockInRadarData] = useState([]);
  const [stockMonitorData, setStockMonitorData] = useState([]);
  const [etfServiceData, setEtfServiceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [sellingRecommendations, setSellingRecommendations] = useState([]);
  const [userStocks, setUserStocks] = useState([]);
  const [cookies] = useCookies(["userId"]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        financialResponse,
        stockResponse,
        individualStockResponse,
        stockInRadarResponse,
        stockMonitorResponse,
        etfServiceResponse,
      ] = await Promise.all([
        axios.get("https://script.google.com/macros/s/AKfycbymorTjnVzmJr56gY5zoBlD-dUp8bwC-dYwIKdAm2WRjnfpwjgMLpUut9E15rgCbXah/exec"),
        axios.get("https://script.googleusercontent.com/macros/echo?user_content_key=697rrLjwFYb7dZdxmz2WtAK0v7TSdy_D-aQmRL37y1N41_jSxXQRfQ-mNHnJcfFAr-L-FKjj2r5kFAsBYKPkbO6jqPx4ghSfm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDZ1xou3Yh4_OfOhrnVFN_l_7UgENfxTtMYqWp-LqOc5fnHnWUGSpRLqjn72R3VFhw9KRDVeiat-iXRlSyZY22LMiOySTcSiOg&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"),
        axios.get("https://script.googleusercontent.com/macros/echo?user_content_key=M8iUr2Z4ujhnZj3gV3jqyikffgyvfGGgE3LB3d7khmmrPclpYpwHDJT4UsbuwsGWdk_NjhcYGkEiZFHb0g2ZI4og0-Tok6FKm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"),
        axios.get("https://script.googleusercontent.com/macros/echo?user_content_key=w-HugVZsGSi2e9w9LSBN0O_YgJbhC8tlAWzkOyxZh2l3gpghC1nDCt_1FK9DhVd7p2HkWud9SxmcNLyfEF3xmkJwbHGYwmM8m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKpMGqkWjchhovJqlLMOXGv2uBTmZXjN74kf1Bqh_wzyPBV-9nC5hAENoomaP-RqQJiUHxnwpf8uLXjOdSa07msWDVQTR9xTIg&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"),
        axios.get("https://script.googleusercontent.com/macros/echo?user_content_key=sWCqu1QFJ5Q66c1GGYLcUlsDZ6saLTQZhHqE9HK-f2L__qCglxC6dFGy6LU-wl6FftvL3ZnHCYzGsz899pWZoZIBSb7jeHCCm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"),
        axios.get("https://script.google.com/macros/s/AKfycbyAGkiTm2CCB56gtwdO2EpHhNb75gnogCedBoF3tnsR6mcfjY5LwpDEaDUS7mH0F4a3Xg/exec"),
      ]);

      setFinancialData(financialResponse.data);
      setStockData(stockResponse.data);
      setIndividualStockData(individualStockResponse.data);
      setStockInRadarData(stockInRadarResponse.data);
      setStockMonitorData(stockMonitorResponse.data);
      setEtfServiceData(etfServiceResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSellingAdvice = useCallback(() => {
    console.log("Generating selling advice...");
    const userStocks = stockData.filter(stock => stock.user_id === cookies.userId);
    setUserStocks(userStocks);
  
    const recommendations = userStocks
      .map((stock) => {
        const stockDetails = stockMonitorData.find(
          (s) => s.stock_id === stock.stock_id
        );
        return {
          stockName: stockDetails.stockName,
          price: stockDetails.LTP,
          scopeToGrow: parseInt(stockDetails.scopeToGrow.replace("%", "")),
          action: stockDetails.action,
        };
      })
      .filter((stock) => stock.scopeToGrow <= 10 || stock.action === "Sell");
  
    setSellingRecommendations(recommendations);
    
  }, [stockData, stockMonitorData, cookies.userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (financialData.length > 0) {
      generateSellingAdvice();
    }
  }, [financialData, generateSellingAdvice]);

  const resetNotificationCount = () => {
    setNotifications([]);


  };

  return (
    <DataContext.Provider
      value={{
        financialData,
        stockData,
        individualStockData,
        stockInRadarData,
        stockMonitorData,
        etfServiceData,
        userStocks,
        notifications,
        loading,
        fetchData,
        setLoading,
        sellingRecommendations,
        generateSellingAdvice,
        resetNotificationCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
