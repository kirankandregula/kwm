import React from 'react';
import "./../App.css";

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
    <div className="about-us-container p-2 " style={{ background: "linear-gradient(45deg, #ADD8E6, #ffc3a0)", marginTop: "80px", borderRadius: "20px", marginBottom: "80px" }}>
      <h2 className='text-center'>About Us</h2>
      <div className="text-center mb-4">
        <img src="https://i.ibb.co/SsdfRXP/KK-Wealth-Mills-transparent.png" alt="KK Wealth Mills Logo" style={{ maxWidth: "200px", marginBottom: "20px" }} />
      </div>
      <p>Welcome to KK Wealth Mills, your personal finance portfolio management solution founded by Kiran Kandregula.</p>
      <p>At KK Wealth Mills, we are dedicated to helping you manage and grow your personal finance portfolio efficiently. Our goal is to provide you with the tools and resources needed to achieve your financial objectives.</p>

      {/* Billing Details */}
      <div className="billing-details p-3 mt-4" style={{ background: "#f2f2f2", borderRadius: "10px" }}>
        <h3 className="text-center">Billing Details</h3>
        <p>We charge for every quarter based on your profit only. Here's how our billing works:</p>
        <ul>
          <li>We won't charge for the first 5% profit.</li>
          <li>For the remaining profit, we charge 20%.</li>
        </ul>
        <p>This transparent billing policy ensures that our customers can easily understand our pricing structure.</p>
        {/* Additional details based on example profit */}
        <p>Let's say your profit for the quarter is ₹{profit}. The initial investment is ₹{initialInvestment}.</p>
        <p>1. We won't charge for the first 5% profit, which is ₹{Math.min(5000, profit)}.</p>
        <p>2. For the remaining profit (₹{Math.max(profit - 5000, 0)}), we charge 20%, which is ₹{totalCharge}.</p>
        <p>So, the total charge for this quarter would be ₹{Math.max(totalCharge, 0)}.</p>
      </div>
    </div>
  );
};

export default About;
