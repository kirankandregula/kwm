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

const StockInRadar = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['userName', 'userRole']);
  const navigate = useNavigate();
  const [hasStocks, setHasStocks] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=qMtoCMo4kWltfUjYaRn6GopWqqNndEC1bezXUgK8M0LeH5jWm4drHpNHHELMyw7si7YwnvME1t3xMbELX7VJ_sn8N9MXtc1Jm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnPqU_W-BE9pyJ8Qi7blHIc0Q4hbO2tLSd-Ckxc38EV02_Qf-RqQCqPnZjz_HV7aw1twIbDb-TFUbhpkZ24DVnzhFvnZ3JX3SHg&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"
        );
        
        const sortedData = response.data
          .sort((a, b) => parseFloat(b.stg.replace("%", "")) - parseFloat(a.stg.replace("%", "")));
    
        setData(sortedData);
        if (response.data.some((stock) => stock.Ticker !== "")) {
          setHasStocks(true);
        }
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

  const handleSort = (columnName) => {
    const sortedData = [...data].sort((a, b) =>
      a[columnName] > b[columnName] ? 1 : -1
    );
    setData(sortedData);
  };

  if (loading) {
    return (
      <div className="container mt-3">
        <div className="row justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="col-sm-12 text-center">
            <ClipLoader color={"#36D7B7"} loading={loading} css={override} size={150} />
          </div>
        </div>
      </div>
    );
  }

  if (!hasStocks) {
    return (
      <div className="container mt-3">
        <div className="row justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="col-sm-12 text-center text-danger">
            <h4>There are no stocks to buy now. Please wait for a few days.</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <div className="row justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="col-sm-12 " style={{marginTop: "70px"}}>
          <div className="table-responsive">
            <table className="table table-striped" style={{marginBottom: "100px"}}>
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
                {data.map((row, index) => (
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
