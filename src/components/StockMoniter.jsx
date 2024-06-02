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

const StockMonitor = () => {
  const { stockMonitorData, loading } = useData();
  const [filterValue, setFilterValue] = useState("");
  const [cookies] = useCookies(["userName", "userRole"]);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!cookies.userName || !cookies.userRole) {
      navigate("/login");
    } else {
      const sortedData = [...stockMonitorData].sort(
        (a, b) =>
          parseFloat(b.scopeToGrow.replace("%", "")) -
          parseFloat(a.scopeToGrow.replace("%", ""))
      );
      setData(sortedData);
    }
  }, [cookies.userName, cookies.userRole, navigate, stockMonitorData]);

  const getScopeColor = (scope) => {
    const scopeValue = parseFloat(scope.replace("%", ""));
    if (scopeValue <= 10) {
      return "table-danger";
    } else if (scopeValue >= 50) {
      return "text-success";
    } else if (scopeValue >= 30) {
      return "text-warning";
    } else {
      return "text-danger";
    }
  };

  const getHoldSellColor = (holdSell) => {
    return holdSell === "Hold" ? "text-success" : "text-danger";
  };

  const getMarketCapColor = (marketCap) => {
    switch (marketCap) {
      case "Large Cap":
        return "text-success";
      case "Medium Cap":
        return "text-warning";
      case "Small Cap":
        return "text-danger";
      default:
        return "";
    }
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
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        {loading ? (
          <div className="col-sm-12 text-center">
            <ClipLoader
              color={"#36D7B7"}
              loading={loading}
              css={override}
              size={50}
            />
          </div>
        ) : (
          <div className="col-md-12" style={{ marginTop: "60px" }}>
            <h2 className="text-center sm-12 ">Stock Monitor</h2>
            <div className="form-group sm-12 my-2">
              <input
                type="text"
                className="form-control"
                placeholder="Filter by Stock Name or Sector"
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
            <div className="table-responsive">
              <table
                className="table table-striped"
                style={{ marginBottom: "100px" }}
              >
                <thead>
                  <tr>
                    <th onClick={() => handleSort("stockName")}>Stock Name</th>
                    <th onClick={() => handleSort("Sector")}>Sector</th>
                    <th onClick={() => handleSort("pe")}>PE</th>
                    <th onClick={() => handleSort("marketCap")}>Market Cap</th>
                    <th onClick={() => handleSort("LTP")}>LTP</th>
                    <th onClick={() => handleSort("targetPrice")}>
                      Target Price
                    </th>
                    <th onClick={() => handleSort("scopeToGrow")}>
                      Scope to Grow
                    </th>
                    <th onClick={() => handleSort("action")}>Hold/Sell</th>
                    <th onClick={() => handleSort("average")}>Average</th>
                    <th onClick={() => handleSort("presentQuarter")}>
                      Present Quarter
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr
                      key={index}
                      className={
                        parseFloat(row.scopeToGrow.replace("%", "")) <= 10
                          ? "table-danger"
                          : ""
                      }
                    >
                      <td>{row.stockName}</td>
                      <td>{row.Sector}</td>
                      <td>{row.pe}</td>
                      <td className={getMarketCapColor(row.marketCap)}>
                        {row.marketCap}
                      </td>
                      <td>{row.LTP}</td>
                      <td>{row.targetPrice}</td>
                      <td className={getScopeColor(row.scopeToGrow)}>
                        {row.scopeToGrow}
                      </td>
                      <td className={getHoldSellColor(row.action)}>
                        {row.action}
                      </td>
                      <td
                        className={
                          row.average === "Average" ? "text-danger" : ""
                        }
                      >
                        {row.average}
                      </td>
                      <td>{row.presentQuarter}</td>
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
