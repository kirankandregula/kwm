import React from "react";
import { Container, Typography, Paper, Grid, Button } from "@mui/material";
import { styled } from "@mui/system";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const AboutContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(10),
  padding: theme.spacing(2),
  background: "linear-gradient(45deg, #ADD8E6, #ffc3a0)",
  borderRadius: "20px",
}));

const SectionContainer = styled(Paper)(({ theme }) => ({
  background: "#f2f2f2",
  borderRadius: "10px",
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const IconContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const StartJourneyContainer = styled(SectionContainer)(({ theme }) => ({
  background: "#f2f2f2",
  textAlign: "center",
  boxShadow: "none",
  marginTop: theme.spacing(6),
}));

const About = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login"); // Navigate to login page
  };

  return (
    <AboutContainer maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        About Aartha Investments
      </Typography>
      <SectionContainer elevation={3}>
        <IconContainer>
          <BusinessCenterIcon sx={{ fontSize: 60, color: "#2E8B57" }} />
        </IconContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body2" paragraph>
          Welcome to Aartha Investments, your trusted partner in personal
          finance portfolio management.
        </Typography>
        <Typography variant="body2" paragraph>
          At Aartha Investments, our mission is to empower individuals to
          achieve their financial goals through transparent and efficient
          portfolio management services.
        </Typography>
      </SectionContainer>
      <SectionContainer elevation={3}>
        <IconContainer>
          <MonetizationOnIcon sx={{ fontSize: 60, color: "#FFD700" }} />
        </IconContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="body2" paragraph>
          We specialize in providing personalized investment strategies tailored
          to meet your financial objectives.
        </Typography>
        <Typography variant="body2" paragraph>
          Whether you are planning for retirement, saving for education, or
          seeking to grow your wealth, we offer comprehensive solutions designed
          to optimize your investments.
        </Typography>
        <Typography variant="body2" paragraph>
          You can start your journey with Aartha Investments with an initial
          investment of just ₹25,000, making wealth management accessible to
          everyone.
        </Typography>
      </SectionContainer>
      <SectionContainer elevation={3}>
        <IconContainer>
          <PaymentIcon sx={{ fontSize: 60, color: "#FF6347" }} />
        </IconContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Billing Transparency
        </Typography>
        <Typography variant="body2" paragraph>
          At Aartha Investments, we believe in transparency and fairness in our
          billing practices.
        </Typography>
        <Typography variant="body2" paragraph>
          We charge based on your profit, ensuring that our fees are aligned
          with your success. Our billing structure is straightforward: we waive
          charges for the first 5% of profit and apply a 20% fee on any
          additional profit, providing clarity and predictability to our
          clients.
        </Typography>
        <Typography variant="body2" paragraph>
          This commitment to transparency ensures that you can confidently
          navigate your financial journey with us.
        </Typography>
      </SectionContainer>
      {/* Start Journey Section */}
      <StartJourneyContainer elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Start Your Journey with Aartha Investments
        </Typography>
        <Typography variant="body2" paragraph>
          You can start your journey with Aartha Investments with an initial
          investment of just ₹25,000, making wealth management accessible to
          everyone.
        </Typography>
        <Typography variant="body2" paragraph>
          Begin investing today with Aartha Investments and unlock the potential
          to grow your wealth.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </StartJourneyContainer>
    </AboutContainer>
  );
};

export default About;
