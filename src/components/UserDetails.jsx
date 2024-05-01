import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function UserDetails() {
  const [filteredData, setFilteredData] = useState(null);
  const [cookies] = useCookies(['userId', 'userName', 'userRole']);
  const [loading, setLoading] = useState(true);
  const [totalLatestValue, setTotalLatestValue] = useState(0); // State to store total latest value
  const [averagePE, setAveragePE] = useState(0); // State to store average PE
  const [averageScopeToGrow, setAverageScopeToGrow] = useState(0); // State to store average scope to grow
  const [preValue, setPreValue] = useState(0); // Previous value for Quarterly Return calculation
  const [userStocks, setUserStocks] = useState([]); // State to store user's stock data

  const { userId, preValue: preValueParam } = useParams(); // Extracting preValue from URL params

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's stock data
        const response = await axios.get(
          `https://script.googleusercontent.com/macros/echo?user_content_key=697rrLjwFYb7dZdxmz2WtAK0v7TSdy_D-aQmRL37y1N41_jSxXQRfQ-mNHnJcfFAr-L-FKjj2r5kFAsBYKPkbO6jqPx4ghSfm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDZ1xou3Yh4_OfOhrnVFN_l_7UgENfxTtMYqWp-LqOc5fnHnWUGSpRLqjn72R3VFhw9KRDVeiat-iXRlSyZY22LMiOySTcSiOg&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz`
        );
        const stockData = response.data;
    
        // Filter data based on userId
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

        // Set previous value from URL params
        setPreValue(preValueParam);
        // Set user's stock data
        setUserStocks(filteredUserData);
      } catch (error) {
        console.error("Error fetching user stock data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId, preValueParam]);
  
  return (
    <div className="user-details mt-5">
      <div className="d-flex justify-content-between">
        <UserMetricsCard 
          totalLatestValue={totalLatestValue} 
          averagePE={averagePE} 
          averageScopeToGrow={averageScopeToGrow}
          preValue={preValue}
        />
        <div className="card mx-auto mt-4  my-2 text-white text-center" style={{width: "300px"}}>
          <div className="card-body bg-info" style={{marginTop: "20px",borderRadius: "10px"}}>
            <h5 className="card-title text-center">User Stocks</h5>
            {userStocks.map(stock => (
              <p key={stock.stock_id}>{stock.stock_id} - Quantity: {stock.quantity}</p>
            ))}
          </div>
        </div>
      </div>

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
                  <th>Latest Value</th> {/* New column */}
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
            <Link to={`/portfolio/${cookies.userId}/${preValue}`} className="btn btn-secondary mb-1">Back</Link>
          </div>
        </>
      )}
    </div>
  );
}

function UserMetricsCard({ totalLatestValue, averagePE, averageScopeToGrow, preValue }) {
  const quarterlyReturn = ((totalLatestValue - preValue) / preValue * 100).toFixed(2); // Calculate Quarterly Return

  const getColorClass = (quarterlyReturn) => {
    if (quarterlyReturn < 5) {
      return "bg-secondary";
    } else if (quarterlyReturn >= 5 && quarterlyReturn <= 10) {
      return "bg-warning";
    } else {
      return "bg-success";
    }
  };

  return (
    <div className="card mx-auto mt-4  my-2 text-white text-center" style={{width: "300px"}}>
      <div className={`card-body ${getColorClass(quarterlyReturn)}` } style={{marginTop: "20px",borderRadius: "10px"}}>
        <h5 className="card-title text-center">User Metrics</h5>
        <p className="card-text">Total Latest Value: {totalLatestValue}</p>
        <p className="card-text">Quarterly Return: {quarterlyReturn}%</p>
        <p className="card-text">Average PE: {averagePE}</p>
        <p className="card-text">Average Scope to Grow: {averageScopeToGrow}</p>
      </div>
    </div>
  );
}

function StockDetails({ stock }) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          `https://script.googleusercontent.com/macros/echo?user_content_key=M8iUr2Z4ujhnZj3gV3jqyikffgyvfGGgE3LB3d7khmmrPclpYpwHDJT4UsbuwsGWdk_NjhcYGkEiZFHb0g2ZI4og0-Tok6FKm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz&stock_id=${stock.stockId}`
        );
        const fetchedStockData = response.data.find(item => item.stock_id === stock.stockId);
        setStockData(fetchedStockData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [stock]);

  if (loading) {
    return <tr><td colSpan="12">Loading...</td></tr>;
  }

  if (!stockData) {
    return null;
  }

  const latestValue = (stockData.LTP * stock.quantity).toFixed(2); // Round latest value

  return (
    <tr>
      <td>{stock.stockId}</td>
      <td>{stockData.stockName}</td>
      <td>{stockData.Sector}</td>
      <td>{stockData.pe}</td>
      <td>{stockData.marketCap}</td>
      <td>{stockData.targetPrice}</td>
      <td>{stockData.lowPrice}</td>
      <td style={{ color: getScopeToGrowColor(stockData.scopeToGrow) }}>{stockData.scopeToGrow}</td>
      <td>{stockData.action}</td>
      <td>{stock.quantity}</td>
      <td>{stockData.LTP}</td>
      <td>{latestValue}</td> {/* Display rounded latest value */}
    </tr>
  );
}

function getScopeToGrowColor(scopeToGrow) {
  if (typeof scopeToGrow !== 'string') {
    // Handle the case where scopeToGrow is not a string
    return 'black'; // Return a default color or handle it as needed
  }

  const scopeValue = parseInt(scopeToGrow.replace('%', ''));
  if (scopeValue < 30) {
    return 'red';
  } else if (scopeValue >= 30 && scopeValue <= 50) {
    return 'orange';
  } else {
    return 'green';
  }
}

export default UserDetails;
