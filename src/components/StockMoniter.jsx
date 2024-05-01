import React, { useState, useEffect } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const StockMoniter = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [cookies] = useCookies(['userName', 'userRole']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=XZrlUsEM2NAI5dbFQqlYVKB3xN7iTe-FzVN4GGAP8ik87A3WImQ3BmVAOocLrEEHrgg3YYe5WxACl91J0dfbx9W-i4AKY-TVm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLIsAGIJk7nwByX2kP7E6KcaQfttZZzFJP9CDHuNsY9n9zt9O8kY-ipqgo7HRuB6PbxLehp36rzvpZB8rFGwxXnkU3qpDqKHHg&lib=MB2EvUQOnusAtbHEY3orlAmtjq-h6POhb"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!cookies.userName || !cookies.userRole) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [cookies.userName, cookies.userRole, navigate]);

  const getScopeColor = (scope) => {
    if (parseFloat(scope.replace("%", "")) >= 50) {
      return "text-success";
    } else if (parseFloat(scope.replace("%", "")) >= 30) {
      return "text-warning";
    } else {
      return "text-danger";
    }
  };

  const getHoldSellColor = (holdSell) => {
    return holdSell === "Hold" ? "text-success" : "text-danger";
  };

  const handleSort = (columnName) => {
    const sortedData = [...data].sort((a, b) =>
      a[columnName] > b[columnName] ? 1 : -1
    );
    setData(sortedData);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredData = data.filter(
    (row) =>
      row.TICKER && // Filter out rows where TICKER is null or undefined
      (row.TICKER.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.Sector.toLowerCase().includes(filterValue.toLowerCase()))
  );

  return (
    <div className="container mt-3">
      <div className="row justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        {loading ? (
          <div className="col-sm-12 text-center">
            <ClipLoader color={"#36D7B7"} loading={loading} css={override} size={150} />
          </div>
        ) : (
          <div className="col-sm-12 mt-5">
            <input
              type="text"
              placeholder="Filter by ticker or sector"
              value={filterValue}
              onChange={handleFilterChange}
              className="form-control mb-3"
            />
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("TICKER")}>Ticker</th>
                    <th onClick={() => handleSort("Sector")}>Sector</th>
                    <th onClick={() => handleSort("LTP")}>LTP</th>
                    <th onClick={() => handleSort("SCOPE TO GROW")}>Scope to Grow</th>
                    <th onClick={() => handleSort("HOLD/SELL")}>Hold/Sell</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.TICKER}</td>
                      <td>{row.Sector}</td>
                      <td>{row.LTP}</td>
                      <td className={getScopeColor(row["SCOPE TO GROW"])}>{row["SCOPE TO GROW"]}</td>
                      <td className={getHoldSellColor(row["HOLD/SELL"])}>{row["HOLD/SELL"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockMoniter;
