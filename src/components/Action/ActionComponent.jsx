import React from "react";
import { Box } from "@mui/material";
import BuyingAdvice from "./BuyingAdvice";
import SellingAdvice from "./SellingAdvice";

const MainPage = () => {
  return (
    <Box
      className="action-container"
      p={3}
      sx={{
        width: "80%",
        mt: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        margin: "0 auto",
      }}
    >
      <BuyingAdvice />
      <SellingAdvice />
    </Box>
  );
};

export default MainPage;
