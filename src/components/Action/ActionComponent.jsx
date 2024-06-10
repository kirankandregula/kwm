import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useData } from "../DataProvider";
import { useCookies } from "react-cookie";
import BuyingAdvice from "./BuyingAdvice";
import SellingAdvice from "./SellingAdvice";

const ActionComponent = () => {
  const {
    financialData,
    stockData,
    stockInRadarData,
    stockMonitorData,
    loading,
  } = useData();
  const [cookies] = useCookies(["userId"]);
  const userId = cookies.userId;
  const [uniqueData, setUniqueData] = useState([]);

  useEffect(() => {
    const combinedData = [...stockInRadarData, ...stockMonitorData];
    const uniqueStocks = [];
    const duplicates = new Set();

    combinedData.forEach((stock) => {
      if (uniqueStocks.find((item) => item.stockName === stock.stockName)) {
        duplicates.add(stock.stockName);
      } else {
        uniqueStocks.push(stock);
      }
    });

    setUniqueData(uniqueStocks);
  }, [stockInRadarData, stockMonitorData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const userFinancialData = financialData.find(
    (user) => user.user_id === userId
  );
  const userStocks = stockData.filter((stock) => stock.user_id === userId);
  
  console.log("Rendering ActionComponent");

  return (
    <Box className="action-container" p={3} sx={{ width: "100%", mt: 8 }}>
      <BuyingAdvice
        userFinancialData={userFinancialData}
        userStocks={userStocks}
        individualStockData={uniqueData}
      />
      <SellingAdvice />
    </Box>
  );
};

export default ActionComponent;
