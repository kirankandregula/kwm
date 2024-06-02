import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useData } from "./DataProvider"; // Adjust the import path as needed

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const StockInRadar = () => {
  const { stockInRadarData, loading } = useData();
  const [filterValue, setFilterValue] = useState("");
  const [cookies] = useCookies(["userName", "userRole"]);
  const navigate = useNavigate();
  const [hasStocks, setHasStocks] = useState(false);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (!cookies.userName || !cookies.userRole) {
      navigate("/login");
    } else {
      if (stockInRadarData.some((stock) => stock.Ticker !== "")) {
        setHasStocks(true);
      }
      const sorted = [...stockInRadarData].sort(
        (a, b) =>
          parseFloat(b.stg.replace("%", "")) -
          parseFloat(a.stg.replace("%", ""))
      );
      setSortedData(sorted);
    }
  }, [cookies.userName, cookies.userRole, navigate, stockInRadarData]);

  const getScopeColor = (scope) => {
    if (parseFloat(scope.replace("%", "")) >= 50) {
      return "text-success";
    } else if (parseFloat(scope.replace("%", "")) >= 30) {
      return "text-warning";
    } else {
      return "text-danger";
    }
  };

  const handleSort = (columnName) => {
    const sorted = [...sortedData].sort((a, b) =>
      a[columnName] > b[columnName] ? 1 : -1
    );
    setSortedData(sorted);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredData = sortedData.filter(
    (row) =>
      row.stock.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.industry.toLowerCase().includes(filterValue.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mt-3">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="col-sm-12 text-center">
            <ClipLoader
              color={"#36D7B7"}
              loading={loading}
              css={override}
              size={150}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!hasStocks) {
    return (
      <div className="container mt-3">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="col-sm-12 text-center text-danger">
            <h4>There are no stocks to buy now. Please wait for a few days.</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <h2
          className="text-center sm-12 text-success"
          style={{ marginTop: "70px" }}
        >
          Stocks in our Radar
        </h2>
        <div className="col-sm-12 my-2">
          <input
            type="text"
            placeholder="Filter by stock name or industry"
            value={filterValue}
            onChange={handleFilterChange}
            className="form-control mb-3"
          />
          <div className="table-responsive">
            <table
              className="table table-striped"
              style={{ marginBottom: "100px" }}
            >
              <thead>
                <tr>
                  <th onClick={() => handleSort("stock")}>Stock</th>
                  <th onClick={() => handleSort("industry")}>Industry</th>
                  <th onClick={() => handleSort("pe")}>PE</th>
                  <th onClick={() => handleSort("ltp")}>LTP</th>
                  <th onClick={() => handleSort("target")}>Target</th>
                  <th onClick={() => handleSort("stg")}>Scope to Grow</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.stock}</td>
                    <td>{row.industry}</td>
                    <td>{row.pe}</td>
                    <td>{row.ltp}</td>
                    <td>{row.target}</td>
                    <td className={getScopeColor(row.stg)}>{row.stg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInRadar;
