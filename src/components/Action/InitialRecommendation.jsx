import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const InitialRecommendation = ({
  liquidFunds,
  initialRecommendationsCount,
  handleGenerateAdviceClick,
}) => {
  return (
    <Box
      className="initial-recommendation"
      textAlign="center"
      padding="24px"
      border="1px solid #ccc"
      borderRadius="8px"
      backgroundColor="#f9f9f9"
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
    >
      <Typography variant="h6" color="green">
        Buying Recommendation
      </Typography>
      {liquidFunds >= 25000 / 5 ? (
        <>
          <Typography variant="body1">
            You have {initialRecommendationsCount} stocks to buy
          </Typography>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleGenerateAdviceClick}
            sx={{
              backgroundColor: "green",
              color: "white",
              fontSize: "14px",
              padding: "8px 16px",
              marginTop: "8px",
              "&:hover": {
                backgroundColor: "darkgreen",
              },
            }}
          >
            Generate Advice
          </Button>
        </>
      ) : (
        <Typography variant="body1" color="red">
          You have {liquidFunds} only, you need at least {25000 / 5} amount to
          buy stocks
        </Typography>
      )}
    </Box>
  );
};

export default InitialRecommendation;
