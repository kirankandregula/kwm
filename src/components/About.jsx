import React from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";

const AboutContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(10),
  padding: theme.spacing(2),
  background: "linear-gradient(45deg, #ADD8E6, #ffc3a0)",
  borderRadius: "20px",
}));

const BillingDetails = styled(Paper)(({ theme }) => ({
  background: "#f2f2f2",
  borderRadius: "10px",
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const About = () => {
  // Example profit amount and initial investment
  const profit = 20000; // ₹20,000 profit
  const initialInvestment = 100000; // ₹1,00,000 initial investment

  // Calculate the charge based on profit (20%)
  const calculateCharge = (profit) => {
    let charge = 0;
    if (profit > 5000) {
      charge = (profit - 5000) * 0.20; // Charging 20% for the remaining profit after 5000
    }
    return charge;
  };

  // Calculate the total charge
  const totalCharge = calculateCharge(profit);

  return (
    <AboutContainer maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body2" paragraph>
        Welcome to Aartha Investments, your personal finance portfolio management solution founded by Kiran Kandregula.
      </Typography>
      <Typography variant="body2" paragraph>
        At KK Wealth Mills, we are dedicated to helping you manage and grow your personal finance portfolio efficiently. Our goal is to provide you with the tools and resources needed to achieve your financial objectives.
      </Typography>

      {/* Billing Details */}
      <BillingDetails elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Billing Details
        </Typography>
        <Typography variant="body2" paragraph>
          We charge for every quarter based on your profit only. Here's how our billing works:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="We won't charge for the first 5% profit." />
          </ListItem>
          <ListItem>
            <ListItemText primary="For the remaining profit, we charge 20%." />
          </ListItem>
        </List>
        <Typography variant="body2" paragraph>
          This transparent billing policy ensures that our customers can easily understand our pricing structure.
        </Typography>
        {/* Additional details based on example profit */}
        <Typography variant="body2" paragraph>
          Let's say your profit for the quarter is ₹{profit}. The initial investment is ₹{initialInvestment}.
        </Typography>
        <Typography variant="body2" paragraph>
          1. We won't charge for the first 5% profit, which is ₹{Math.min(5000, profit)}.
        </Typography>
        <Typography variant="body2" paragraph>
          2. For the remaining profit (₹{Math.max(profit - 5000, 0)}), we charge 20%, which is ₹{totalCharge}.
        </Typography>
        <Typography variant="body2" paragraph>
          So, the total charge for this quarter would be ₹{Math.max(totalCharge, 0)}.
        </Typography>
      </BillingDetails>
    </AboutContainer>
  );
};

export default About;
