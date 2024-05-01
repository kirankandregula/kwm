import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const SpyingPage = () => {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://script.google.com/macros/s/AKfycbyGAYw77L-A9bblePHyzh32mZfe0KVjnZ06BQCM9ZPiTiKnL_GkxxFoQW4IU6Fe-vub/exec",
      );
      setData(response.data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      a[columnName] > b[columnName] ? 1 : -1,
    );
    setData(sortedData);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredData = data.filter(
    (row) =>
      row.Ticker.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.Sector.toLowerCase().includes(filterValue.toLowerCase()),
  );

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <input
            type="text"
            placeholder="Filter by ticker or sector"
            value={filterValue}
            onChange={handleFilterChange}
            className="form-control mb-3"
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th onClick={() => handleSort("Ticker")}>Ticker</th>
              <th onClick={() => handleSort("Sector")}>Sector</th>
              <th onClick={() => handleSort("Scope to Grow")}>Scope to Grow</th>
              <th onClick={() => handleSort("Hold/Sell")}>Hold/Sell</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.Ticker}</td>
                <td>{row.Sector}</td>
                <td className={getScopeColor(row["Scope to Grow"])}>
                  {row["Scope to Grow"]}
                </td>
                <td className={getHoldSellColor(row["Hold/Sell"])}>
                  {row["Hold/Sell"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpyingPage;
