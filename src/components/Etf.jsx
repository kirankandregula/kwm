import React from "react";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import { useData } from "./DataProvider"; // Import the DataProvider

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const EtfService = () => {
  const { etfServiceData, loading } = useData(); // Access the etfServiceData and loading state from DataProvider

  const filteredData = Object.entries(etfServiceData)
    .filter(
      ([_, details]) =>
        !Object.values(details).every((value) => value === "NA") &&
        details["ETF Name"] !== ""
    )
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="sweet-loading">
          <ClipLoader
            color={"#36D7B7"}
            loading={loading}
            css={override}
            size={150}
          />
        </div>
      </div>
    );
  }

  const triggerColumns = Object.keys(filteredData[Object.keys(filteredData)[0]])
    .slice(2)
    .filter((col) =>
      Object.values(filteredData).some((details) => details[col] === "TRIGGER")
    );

  return (
    <div>
      <div
        className="table-responsive "
        style={{ marginTop: "80px", marginBottom: "80px" }}
      >
        <h2 className="text-success text-center">ETF Service</h2>
        <table className="table table-bordered table-striped shadow">
          <thead className="bg-primary text-white">
            <tr>
              <th>Stock</th>
              <th>CMP</th>
              {triggerColumns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredData).map(([stock, details]) => (
              <tr key={stock}>
                <td>{details["ETF Name"]}</td>
                <td>{details.CMP}</td>
                {triggerColumns.map((col) => (
                  <td
                    key={col}
                    className={details[col] === "TRIGGER" ? "text-danger" : ""}
                  >
                    {details[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EtfService;
