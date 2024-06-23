import React from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const AboutContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(7),
  marginBottom: theme.spacing(10),
  padding: theme.spacing(2),
  background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  backgroundImage:
    "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')",
  backgroundBlendMode: "overlay",
  backgroundSize: "cover",
  borderRadius: "20px",
}));

const SectionContainer = styled(Paper)(({ theme }) => ({
  background: "#f2f2f2",
  borderRadius: "10px",
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
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

const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: "10px 20px",
  fontSize: "16px",
  transition: "background-color 0.3s, transform 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.primary?.dark || "#1976d2", // Added fallback value
    transform: "scale(1.05)",
  },
}));

const About = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login"); // Navigate to login page
  };

  return (
    <AboutContainer
      maxWidth="md"
      sx={{ marginTop: isLargeScreen ? "80px" : "30px" }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ mt: "28px", fontWeight: "bold", color: "#1C3D5A" }}
        gutterBottom
      >
        About Artha Investments
      </Typography>

      <SectionContainer elevation={3}>
        <IconContainer>
          <BusinessCenterIcon sx={{ fontSize: 60, color: "#2E8B57" }} />
        </IconContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body2" paragraph>
          Welcome to Artha Investments, your trusted partner in personal finance
          portfolio management.
        </Typography>
        <Typography variant="body2" paragraph>
          At Artha Investments, our mission is to empower individuals to achieve
          their financial goals through transparent and efficient portfolio
          management services. We believe in building lasting relationships with
          our clients based on trust, integrity, and mutual success.
        </Typography>
        <Typography variant="body2" paragraph>
          Our team of seasoned financial experts is dedicated to providing
          personalized strategies that cater to your unique financial needs. We
          leverage cutting-edge technology and data-driven insights to optimize
          your investments and maximize returns.
        </Typography>
        <Typography variant="body2" paragraph>
          Whether you're planning for retirement, saving for a major purchase,
          or simply looking to grow your wealth, Artha Investments is here to
          guide you every step of the way. With our client-centric approach, you
          can confidently navigate the complexities of the financial world and
          achieve your financial aspirations.
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
          At Artha Investments, we specialize in providing personalized
          investment strategies tailored to meet your unique financial
          objectives.
        </Typography>
        <Typography variant="body2" paragraph>
          Our comprehensive suite of services includes:
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Portfolio Management:</strong> Utilize our advanced portfolio
          services to manage your investments effectively. Our expert team
          leverages your unique user details to tailor a strategy that fits your
          financial goals.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Performance History:</strong> Review our detailed history to
          see the track record of our recommendations and services. Transparency
          and proven results are at the core of our offering.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Actionable Insights:</strong> Receive timely buying and
          selling recommendations to make informed investment decisions and
          optimize your portfolio performance.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>ETF Services:</strong> Gain access to a diversified portfolio
          of ETFs designed to maximize returns and minimize risk.
        </Typography>
        <Typography variant="body2" paragraph>
          Begin your wealth management journey with Artha Investments with an
          initial investment of just ₹25,000. Our services make sophisticated
          investment strategies accessible to everyone.
        </Typography>
        <Typography variant="body2" paragraph>
          Join us at Artha Investments and experience a tailored approach to
          achieving your financial aspirations.
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
          At Artha Investments, we believe in transparency and fairness in our
          billing practices.
        </Typography>
        <Typography variant="body2" paragraph>
          At Artha Investments, we believe in growing together with our clients.
          Our unique billing structure ensures that we only succeed when you do.
          Here’s how it works:
        </Typography>
        <Typography variant="body2" paragraph>
          1. <strong>Profit First, Fees Later</strong>: We don't charge anything
          until you make a profit.
        </Typography>
        <Typography variant="body2" paragraph>
          2. <strong>5% Profit Cushion</strong>: Enjoy the first 5% of your
          profit completely fee-free.
        </Typography>
        <Typography variant="body2" paragraph>
          3. <strong>Performance-Based Fee</strong>: Once your profit exceeds
          the 5% threshold, we apply a modest 20% fee on the additional profit.
        </Typography>
        <Typography variant="body2" paragraph>
          This transparent and client-centric approach ensures you keep more of
          your earnings while aligning our success with yours. With Artha
          Investments, you can trust that our priority is to maximize your
          returns.
        </Typography>
        <Typography variant="body2" paragraph>
          This commitment to transparency ensures that you can confidently
          navigate your financial journey with us.
        </Typography>
      </SectionContainer>

      {/* Start Journey Section */}
      <StartJourneyContainer elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Start Your Journey with Artha Investments
        </Typography>
        <Typography variant="body1" paragraph>
          Take the first step towards achieving your financial goals. With an
          initial investment of just ₹25,000, Artha Investments makes wealth
          management accessible to everyone.
        </Typography>
        <Typography variant="body1" paragraph>
          Whether you're planning for retirement, saving for your child's
          education, or simply looking to grow your wealth, Artha Investments is
          here to guide you every step of the way.
        </Typography>
        <Typography variant="body1" paragraph>
          Begin investing today with Artha Investments and unlock the potential
          to grow your wealth with personalized strategies and expert insights.
        </Typography>
        <CustomButton
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={handleGetStarted}
        >
          Get Started
        </CustomButton>
      </StartJourneyContainer>
    </AboutContainer>
  );
};

export default About;
