import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../App.css";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function AdminPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://script.google.com/macros/s/AKfycbymorTjnVzmJr56gY5zoBlD-dUp8bwC-dYwIKdAm2WRjnfpwjgMLpUut9E15rgCbXah/exec"
      );

      const userData = response.data;

      const mappedCards = userData.map((user) => {
        return {
          userId: user.user_id,
          username: user.Name,
          preValue : user.Previous_Value,
          gold: user.Gold,
          debt: user.Debt,
        };
      });

      setCards(mappedCards);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleCardClick = (userId, previousValue) => {
    // Call another component with the parameter username
    console.log(previousValue);
    navigate(`/user-details/${userId}`);
  };
  

  return (
    <div className="container">
      <h1 className="mb-4 text-center" style={{ marginTop: "70px" }}>
        PortFolio Data
      </h1>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        {loading ? (
          // Display spinner while loading
          <div className="sweet-loading">
            <ClipLoader
              color={"#36D7B7"}
              loading={loading}
              css={override}
              size={150}
            />
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    {cards.map((card, index) => (
  <div
    className="col d-flex justify-content-center"
    key={index}
    onClick={() => handleCardClick(card.userId, card.preValue)}
  >
    <div className={`card rounded shadow bg-secondary text-white`}>
      <div className="card-body text-center">
        <h5 className="card-title">{card.username.toUpperCase()}</h5>
        <div className="main d-flex flex-between">
          <div className="values">
            <p className="card-text">Gold: ₹{card.gold}</p>
            <p className="card-text">Debt: ₹{card.debt}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
))}

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
