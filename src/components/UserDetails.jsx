import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import UserMetricsCard from "./UserMetricsCard";
import BillDetailsCard from "./BillDetailsCard";
import StockDetails from "./StockDetails";

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
  const { userId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's stock data
        const stockResponse = await axios.get(
          `https://script.googleusercontent.com/macros/echo?user_content_key=697rrLjwFYb7dZdxmz2WtAK0v7TSdy_D-aQmRL37y1N41_jSxXQRfQ-mNHnJcfFAr-L-FKjj2r5kFAsBYKPkbO6jqPx4ghSfm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDZ1xou3Yh4_OfOhrnVFN_l_7UgENfxTtMYqWp-LqOc5fnHnWUGSpRLqjn72R3VFhw9KRDVeiat-iXRlSyZY22LMiOySTcSiOg&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz`
        );
        const stockData = stockResponse.data;
  
        // Fetch user's financial data
        const financialResponse = await axios.get(
          `https://script.google.com/macros/s/AKfycbymorTjnVzmJr56gY5zoBlD-dUp8bwC-dYwIKdAm2WRjnfpwjgMLpUut9E15rgCbXah/exec`
        );
        const financialData = financialResponse.data;
  
        // Filter financial data based on userId
        const userData = financialData.find(user => user.user_id === parseInt(userId));
  
        // Filter stock data based on userId
        const filteredUserData = stockData.filter(stock => stock.user_id === parseInt(userId));
  
        // Map each filtered data to an object containing stock ID and quantity
        const formattedData = filteredUserData.map(stock => ({
          stockId: stock.stock_id,
          quantity: stock.quantity
        }));
  
        setFilteredData(formattedData);
  
        // Calculate total latest value, average PE, and average scope to grow
        let total = 0;
        let peTotal = 0;
        let scopeTotal = 0;
        formattedData.forEach(stock => {
          axios.get(
            `https://script.googleusercontent.com/macros/echo?user_content_key=M8iUr2Z4ujhnZj3gV3jqyikffgyvfGGgE3LB3d7khmmrPclpYpwHDJT4UsbuwsGWdk_NjhcYGkEiZFHb0g2ZI4og0-Tok6FKm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz&stock_id=${stock.stockId}`
          ).then(response => {
            const fetchedStockData = response.data.find(item => item.stock_id === stock.stockId);
            total += fetchedStockData.LTP * stock.quantity;
            peTotal += fetchedStockData.pe;
            scopeTotal += parseInt(fetchedStockData.scopeToGrow.replace('%', ''));
            setTotalLatestValue(total.toFixed(2)); // Round total to 2 decimal places
            setAveragePE((peTotal / formattedData.length).toFixed(2)); // Calculate average PE
            setAverageScopeToGrow((scopeTotal / formattedData.length).toFixed(2)); // Calculate average scope to grow
          }).catch(error => {
            console.error("Error fetching stock data:", error);
          });
        });
  
        setUserFinancialData(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId]);

  return (
    <div className="container-fluid">
      {/* Display user's name */}
      <h1 className="mt-5 text-center">{userFinancialData ? userFinancialData.Name.toUpperCase() : "User Details"}</h1>
      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12">
          <UserMetricsCard 
            averagePE={averagePE} 
            averageScopeToGrow={averageScopeToGrow}
            preValue={userFinancialData ? userFinancialData.Previous_Value : 0} 
            equity={totalLatestValue}
            gold={userFinancialData ? userFinancialData.Gold : 0}
            debt={userFinancialData ? userFinancialData.Debt : 0}
            totalLatestValue={parseFloat(totalLatestValue) + (userFinancialData ? parseFloat(userFinancialData.Gold) : 0) + (userFinancialData ? parseFloat(userFinancialData.Debt) : 0)}
          />
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12">
          <BillDetailsCard
            preValue={userFinancialData ? userFinancialData.Previous_Value : 0}
            presentValue={parseFloat(totalLatestValue) + (userFinancialData ? parseFloat(userFinancialData.Gold) : 0) + (userFinancialData ? parseFloat(userFinancialData.Debt) : 0)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          {loading ? (
            <div className="sweet-loading">
              <ClipLoader color={"#36D7B7"} loading={loading} css={override} size={150} />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Stock ID</th>
                      <th>Stock Name</th>
                      <th>Sector</th>
                      <th>PE</th>
                      <th>Market Cap</th>
                      <th>Target Price</th>
                      <th>Low Price</th>
                      <th>Scope to Grow</th>
                      <th>Action</th>
                      <th>Quantity</th>
                      <th>LTP</th>
                      <th>Latest Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData && filteredData.map((stock, index) => (
                      <StockDetails key={index} stock={stock} />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center m-2">
                {/* Conditionally render the back button based on user role */}
                {cookies.userRole === "Admin" ? (
                  <button className="btn btn-secondary mb-1" onClick={handleBack}>Back</button>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Function to handle navigation when the back button is clicked
  function handleBack() {
    // Check if the user is an admin
    if (cookies.userRole === "Admin") {
      // Navigate to the portfolio page
      navigate(`/portfolio/${cookies.userId}`);
    } else {
      // Navigate to the homepage
      navigate("/");
    }
  }
}

export default UserDetails;
