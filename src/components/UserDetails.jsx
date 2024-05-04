import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import UserMetricsCard from "./UserMetricsCard";
import BillDetailsCard from "./BillDetailsCard";
import StockTable from "./StockTable";

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
  const [cardsLoading, setCardsLoading] = useState(true); // State for cards loading
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
        let peTotal = 0;
        let scopeTotal = 0;
        let promises = []; // Array to store promises for fetching stock data
        formattedData.forEach(stock => {
          // Push each promise into the promises array
          promises.push(
            axios.get(`https://script.googleusercontent.com/macros/echo?user_content_key=M8iUr2Z4ujhnZj3gV3jqyikffgyvfGGgE3LB3d7khmmrPclpYpwHDJT4UsbuwsGWdk_NjhcYGkEiZFHb0g2ZI4og0-Tok6FKm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz&stock_id=${stock.stockId}`)
          );
        });
  
        // Wait for all promises to resolve
        Promise.all(promises)
          .then(responses => {
            responses.forEach((response, index) => {
              const fetchedStockData = response.data.find(item => item.stock_id === formattedData[index].stockId);
              total += fetchedStockData.LTP * formattedData[index].quantity;
              peTotal += fetchedStockData.pe;
              scopeTotal += parseInt(fetchedStockData.scopeToGrow.replace('%', ''));
            });
            setTotalLatestValue(total.toFixed(2));
            setAveragePE((peTotal / formattedData.length).toFixed(2));
            setAverageScopeToGrow((scopeTotal / formattedData.length).toFixed(2));
            setUserFinancialData(userData);
            setCardsLoading(false); // Set cards loading state to false when all data is fetched
          })
          .catch(error => {
            console.error("Error fetching stock data:", error);
            setCardsLoading(false); // In case of error, still set cards loading state to false
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        setCardsLoading(false); // Set cards loading state to false in case of error
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId]);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
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
    <div className="container-fluid">
     <h3 className="text-center text-secondary" style={{ marginTop: "80px" }}>
  {userFinancialData
     ? `${getGreeting()}.... ${toPascalCase(userFinancialData.Name)}`
    : "Loading Portfolio Details....."}
</h3>
{/* Display message while loading */}
{!userFinancialData && (
  <p className="text-center text-secondary">
    It will take a few seconds. Please wait...
  </p>
)}

    
      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12">
          {cardsLoading ? ( // Render spinner if cards are still loading
            <div className="sweet-loading">
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
        <div className="col-lg-6 col-md-12 col-sm-12">
          {cardsLoading ? ( // Render spinner if cards are still loading
            <div className="sweet-loading">
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
      {/* Stock table */}
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          {loading ? (
            <div className="sweet-loading">
              <ClipLoader color={"#36D7B7"} loading={loading} css={override} size={150} />
            </div>
          ) : (
            <StockTable filteredData={filteredData} />
          )}
        </div>
      </div>
      {/* Back button */}
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="text-center mb-5">
            {cookies.userRole === "Admin" && (
              <button className="btn btn-secondary mb-5" onClick={handleBack}>Back</button>
            )}
          </div>
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
