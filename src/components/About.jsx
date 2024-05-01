import React from 'react';
import "./../App.css";

const About = () => {
  return (
    <div className="about-us-container p-2 " style={{ background: "linear-gradient(45deg, #ADD8E6, #ffc3a0)" ,marginTop:"80px",borderRadius: "20px"}}>
      <h2 className='text-center'>About Us</h2>
      <p>Welcome to KK Wealth Mills, your personal finance portfolio management solution founded by Kiran Kandregula.</p>
      <p>At KK Wealth Mills, we are dedicated to helping you manage and grow your personal finance portfolio efficiently. Our goal is to provide you with the tools and resources needed to achieve your financial objectives.</p>
    </div>
  );
};

export default About;
