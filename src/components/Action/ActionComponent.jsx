import React from "react";
import { Box } from "@mui/material";
import BuyingAdvice from "./BuyingAdvice";
import SellingAdvice from "./SellingAdvice";

const MainPage = () => {
  return (
    <Box className="container" sx={{ marginTop: "120px" }}>
      <BuyingAdvice />
      <SellingAdvice />
    </Box>
  );
};

export default MainPage;
