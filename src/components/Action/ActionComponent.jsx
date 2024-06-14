import React from "react";
import { Box } from "@mui/material";
import { useData } from "../dataprovider/DataProvider";
import BuyingAdvice from "./BuyingAdvice";
import SellingAdvice from "./SellingAdvice";

const ActionComponent = () => {
  const { loading } = useData();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box className="action-container" p={3} sx={{ width: "100%", mt: 8}}>
      <BuyingAdvice />
      <SellingAdvice />
    </Box>
  );
};

export default ActionComponent;
