import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import UserMetricsCard from "./UserMetricsCard";
import BillDetailsCard from "./BillDetailsCard";
import StockTable from "./StockTable";
import "../css/UserDetails.css";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function UserDetails() {
  const [filteredData, setFilteredData] = useState(null);
  const [userFinancialData, setUserFinancialData] = useState(null);
  const [cookies] = useCookies(['userId', 'userName', 'userRole']);
  const [loading, setLoading] = useState(true);
  const [totalLatestValue, setTotalLatestValue] = useState(0);
  const [averagePE, setAveragePE] = useState(0);
  const [averageScopeToGrow, setAverageScopeToGrow] = useState(0);
  const [cardsLoading, setCardsLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockResponse = await axios.get(`https://script.googleusercontent.com/macros/echo?user_content_key=697rrLjwFYb7dZdxmz2WtAK0v7TSdy_D-aQmRL37y1N41_jSxXQRfQ-mNHnJcfFAr-L-FKjj2r5kFAsBYKPkbO6jqPx4ghSfm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDZ1xou3Yh4_OfOhrnVFN_l_7UgENfxTtMYqWp-LqOc5fnHnWUGSpRLqjn72R3VFhw9KRDVeiat-iXRlSyZY22LMiOySTcSiOg&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz`);
        
        const financialResponse = await axios.get(`https://script.google.com/macros/s/AKfycbymorTjnVzmJr56gY5zoBlD-dUp8bwC-dYwIKdAm2WRjnfpwjgMLpUut9E15rgCbXah/exec`);
  
        const stockData = stockResponse.data;
        const financialData = financialResponse.data;
  
        const userData = financialData.find(user => user.user_id === parseInt(userId));
        const filteredUserData = stockData.filter(stock => stock.user_id === parseInt(userId));
  
        const formattedData = filteredUserData.map(stock => ({
          stockId: stock.stock_id,
          quantity: stock.quantity
        }));
  
        setFilteredData(formattedData);
  
        let total = 0;
        let weightedPETotal = 0;
        let weightedScopeTotal = 0;
        let promises = [];
        formattedData.forEach(stock => {
          promises.push(
            axios.get(`https://script.googleusercontent.com/macros/echo?user_content_key=M8iUr2Z4ujhnZj3gV3jqyikffgyvfGGgE3LB3d7khmmrPclpYpwHDJT4UsbuwsGWdk_NjhcYGkEiZFHb0g2ZI4og0-Tok6FKm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz&stock_id=${stock.stockId}`)
          );
        });
  
        Promise.all(promises)
          .then(responses => {
            responses.forEach((response, index) => {
              const fetchedStockData = response.data.find(item => item.stock_id === formattedData[index].stockId);
              const latestValue = fetchedStockData.LTP * formattedData[index].quantity;
                total += latestValue;
                weightedPETotal += fetchedStockData.pe * latestValue;
                weightedScopeTotal += parseInt(fetchedStockData.scopeToGrow.replace('%', '')) * latestValue;
            });
            setTotalLatestValue(total.toFixed(2));
            setAveragePE((weightedPETotal / total).toFixed(2));
            setAverageScopeToGrow((weightedScopeTotal / total).toFixed(2));
            setUserFinancialData(userData);
            setCardsLoading(false);
          })
          .catch(error => {
            console.error("Error fetching stock data:", error);
            setCardsLoading(false);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        setCardsLoading(false);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId]);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }

  function toPascalCase(str) {
    return str.replace(/\s(.)/g, function(match) {
      return match.toUpperCase();
    }).replace(/\s/g, '').replace(/^(.)/, function(match) {
      return match.toUpperCase();
    });
  }
  

  return (
    <div className="container-fluid user-details">
      <h3 className="text-center text-secondary " style={{marginTop: "60px"}}>
        {userFinancialData
          ? `${getGreeting()}.... ${toPascalCase(userFinancialData.Name)}`
          : "Loading Portfolio Details....."}
      </h3>
      {!userFinancialData && (
        <p className="text-center text-secondary">
          It will take a few seconds. Please wait...
        </p>
      )}
      {filteredData && filteredData.length === 0 && (
        <p className="text-center text-danger">
          You don't have any holdings now.
        </p>
      )}
      <div className="row mt-4">
        <div className="col-lg-6 col-md-12 mb-4">
          {cardsLoading ? (
            <div className="spinner-container">
              <ClipLoader color={"#36D7B7"} loading={cardsLoading} css={override} size={150} />
            </div>
          ) : (
            <UserMetricsCard 
              averagePE={averagePE} 
              averageScopeToGrow={averageScopeToGrow}
              preValue={userFinancialData ? userFinancialData.Previous_Value : 0} 
              equity={totalLatestValue}
              gold={userFinancialData ? userFinancialData.Gold : 0}
              debt={userFinancialData ? userFinancialData.Debt : 0}
              totalLatestValue={parseFloat(totalLatestValue) + (userFinancialData ? parseFloat(userFinancialData.Gold) : 0) + (userFinancialData ? parseFloat(userFinancialData.Debt) : 0)}
            />
          )}
        </div>
        <div className="col-lg-6 col-md-12 mb-4">
          {cardsLoading ? (
            <div className="spinner-container">
              <ClipLoader color={"#36D7B7"} loading={cardsLoading} css={override} size={150} />
            </div>
          ) : (
            <BillDetailsCard
              preValue={userFinancialData ? userFinancialData.Previous_Value : 0}
              presentValue={parseFloat(totalLatestValue) + (userFinancialData ? parseFloat(userFinancialData.Gold) : 0) + (userFinancialData ? parseFloat(userFinancialData.Debt) : 0)}
            />
          )}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          {loading ? (
            <div className="spinner-container">
              <ClipLoader color={"#36D7B7"} loading={loading} css={override} size={150} />
            </div>
          ) : (
            <StockTable filteredData={filteredData} />
          )}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 text-center mb-5">
          {cookies.userRole === "Admin" && (
            <button className="btn btn-secondary" onClick={handleBack}>Back</button>
          )}
        </div>
      </div>
    </div>
  );

  function handleBack() {
    if (cookies.userRole === "Admin") {
      navigate(`/portfolio/${cookies.userId}`);
    } else {
      navigate("/");
    }
  }
}

export default UserDetails;
