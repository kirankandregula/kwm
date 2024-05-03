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

const StockMonitor = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [cookies] = useCookies(['userName', 'userRole']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=sWCqu1QFJ5Q66c1GGYLcUlsDZ6saLTQZhHqE9HK-f2L__qCglxC6dFGy6LU-wl6FftvL3ZnHCYzGsz899pWZoZIBSb7jeHCCm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"
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
      row.stockName && // Filter out rows where stockName is null or undefined
      (row.stockName.toLowerCase().includes(filterValue.toLowerCase()) ||
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
              <table className="table table-striped" style={{marginBottom: "100px"}}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("stockName")}>Stock Name</th>
                    <th onClick={() => handleSort("Sector")}>Sector</th>
                    <th onClick={() => handleSort("pe")}>PE</th>
                    <th onClick={() => handleSort("marketCap")}>Market Cap</th>
                    <th onClick={() => handleSort("LTP")}>LTP</th>
                    <th onClick={() => handleSort("targetPrice")}>Target Price</th>
                    <th onClick={() => handleSort("scopeToGrow")}>Scope to Grow</th>
                    <th onClick={() => handleSort("action")}>Hold/Sell</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.stockName}</td>
                      <td>{row.Sector}</td>
                      <td>{row.pe}</td>
                      <td>{row.marketCap}</td>
                      <td>{row.LTP}</td>
                      <td>{row.targetPrice}</td>
                      <td className={getScopeColor(row.scopeToGrow)}>{row.scopeToGrow}</td>
                      <td className={getHoldSellColor(row.action)}>{row.action}</td>
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

export default StockMonitor;
