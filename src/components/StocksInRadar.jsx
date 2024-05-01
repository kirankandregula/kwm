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
          "https://script.googleusercontent.com/macros/echo?user_content_key=67B8Y0EJMW02EPlVPu-PoAMzf3ApIXItOJtrbq8UkpLXG2PcAclwiPo3BNjHb5OnySCSzaJgePLgATb-MIGCWhW6uKtDjEkMm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnBqD5FsSlQPV8j6OXhdGDXNVlPWdlNKC9iNoIk-dLAzlh0ANztJIqzg2pP1UpnQpnXe62d9Ci5tkWju5pNoTen7kAHANyA3YtQ&lib=MB2EvUQOnusAtbHEY3orlAmtjq-h6POhb"
        );
        setData(response.data);
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
        <div className="col-sm-12 mt-5">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>LTP</th>
                  <th>Target</th>
                  <th>Scope to Grow</th>
                </tr>
              </thead>
              <tbody>
                {data.filter((stock) => stock.Ticker !== "").map((row, index) => (
                  <tr key={index}>
                    <td>{row.Ticker}</td>
                    <td>{row.Ltp}</td>
                    <td>{row.Target}</td>
                    <td className={getScopeColor(row["Scope to Grow"])}>{row["Scope to Grow"]}</td>
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
