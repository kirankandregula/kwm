import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import { useParams, useNavigate } from "react-router-dom";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function getColorClass(qr) {
  const percentage = parseFloat(qr); // Convert QR to percentage

  if (percentage < 5) {
    return "bg-secondary";
  } else if (percentage >= 5 && percentage <= 10) {
    return "bg-warning";
  } else {
    return "bg-success";
  }
}

function ViewerPage() {
  const { name } = useParams();
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=PJ-_sBon-6ROFNmsTxt5H22x2jwBBcVYOwgPRfBpQS1nLCnivvluJ1w0-8SUrVdSXXCynU4kODXcDlocawcR4zJomXV63oIJm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMqy3F1P4Fdc_ZYC95gds4g8EZem4AUjoNh107WXpquBj1_1MJz1Zmhu1Y6sn3Rd1VhValBzX8Y_4ESG5SstToNd_L4CvoM-Uw&lib=MB2EvUQOnusAtbHEY3orlAmtjq-h6POhb"
        );
       

        const userCard = response.data.find((card) => card.Name && card.Name.toLowerCase() === name.toLowerCase());

       
        if (userCard) {
          setCard({
            ...userCard,
            PV: Math.round(userCard.PV * 100) / 100,
            EG: Math.round(userCard.EG * 100) / 100, // Round to 2 decimal places
            PE: Math.round(userCard.PE * 100) / 100, // Round to 2 decimal places
            Equity: Math.round(userCard.Equity * 100) / 100 * 100, // Round to 2 decimal places
            Gold: Math.round(userCard.Gold * 100) / 100 * 100, // Round to 2 decimal places
            Debt: Math.round(userCard.Debt * 100) / 100 * 100, // Round to 2 decimal places
          });
        } else {
          console.log(`User with name ${name} not found`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, [name]);

  const handleCardClick = () => {
    // Call another component with the parameter name
    navigate(`/user-details/${name}`);
    // For now, log the name to the console
    console.log(name);
  };

  return (
    <div className="container">
      <h1 className="mb-4 text-center" style={{ marginTop: "70px" }}>Your Portfolio</h1>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        {loading ? ( // Display spinner while loading
          <div className="sweet-loading">
            <ClipLoader color={"#36D7B7"} loading={loading} css={override} size={150} />
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <div className={`card rounded shadow ${getColorClass(card.QR)}`} onClick={handleCardClick}>
                <img
                  src={card.Image}
                  className="card-img-top mx-auto d-block rounded-circle mt-1"
                  style={{ maxWidth: "100px" }} // Adjust the max-width as needed
                  alt={card.Name}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{card.Name}</h5>
                  <div className="main d-flex flex-between">
                    <div className="values">
                      <p className="card-text">PortFolio Value: ₹{card.PV}</p>
                      <p className="card-text">Quarterly Return: {card.QR}</p>
                      <p className="card-text">Expected Growth: {card.EG}%</p>
                      <p className="card-text">PE Ratio: {card.PE}</p>
                    </div>
                    <div className="portfolio">
                      <p>Equity: {card.Equity}%</p>
                      <p>Gold: {card.Gold}%</p>
                      <p>Liquid & Debt: {card.Debt}%</p>
                    </div>
                  </div>
                  {card.Alert && card.Alert.length > 0 ? (
                    <div className="card-footer text-danger values mt-1">
                      Alert Stocks: {card.Alert}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewerPage;
