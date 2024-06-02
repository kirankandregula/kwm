import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useData } from "./DataProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { FaUser } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { green, red, yellow } from "@mui/material/colors";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function AdminPage() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["userName"]);
  const navigate = useNavigate();
  const { financialData, stockData, individualStockData } = useData();

  useEffect(() => {
    if (financialData && stockData && individualStockData) {
      const updatedUserData = financialData.map((user) => {
        const userStocks = stockData.filter(
          (stock) => stock.user_id === user.user_id
        );
        let total = 0;
        userStocks.forEach((stock) => {
          const stockInfo = individualStockData.find(
            (item) => item.stock_id === stock.stock_id
          );
          if (stockInfo) {
            total += stock.quantity * stockInfo.LTP;
          }
        });
        const preValue = parseFloat(user.Previous_Value || 0);
        const presentValue =
          total + parseFloat(user.Gold || 0) + parseFloat(user.Debt || 0);
        const quarterlyReturn = preValue
          ? (((presentValue - preValue) / preValue) * 100).toFixed(2)
          : 0;
        const billableReturn = ((presentValue - preValue) * 0.95).toFixed(2);
        const billableAmount = Math.max((billableReturn * 0.2).toFixed(2), 0); // Ensure billableAmount is not negative
        return {
          ...user,
          presentValue: presentValue.toFixed(2),
          quarterlyReturn,
          billableAmount,
        };
      });
      setUserData(updatedUserData);
      setLoading(false);
    }
  }, [financialData, stockData, individualStockData]);

  const handleRowClick = (userId) => {
    navigate(`/user-details/${userId}`);
  };

  const getGreet = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  function toPascalCase(str) {
    return str
      .replace(/\s(.)/g, function (match) {
        return match.toUpperCase();
      })
      .replace(/\s/g, "")
      .replace(/^(.)/, function (match) {
        return match.toUpperCase();
      });
  }

  return (
    <div className="container">
      <h3 className="text-center text-secondary" style={{ marginTop: "80px" }}>
        Admin Page
      </h3>
      <h4 className="text-secondary text-center py-3">
        {getGreet()}... {toPascalCase(cookies.userName)}
      </h4>
      <p className="text-center text-info">
        Click on the respective column to view portfolio individual details.
      </p>
      <div
        className="d-flex justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        {loading ? (
          <div className="sweet-loading align-items-center">
            <ClipLoader
              color={"#36D7B7"}
              loading={loading}
              css={override}
              size={150}
            />
          </div>
        ) : (
          <TableContainer component={Paper} style={{ marginBottom: "100px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="text-center">Username</TableCell>
                  <TableCell className="text-center">Present Value</TableCell>
                  <TableCell className="text-center">Debt</TableCell>
                  <TableCell className="text-center">
                    Quarterly Return
                  </TableCell>
                  <TableCell className="text-center">Billing Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.map((user, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(user.user_id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="" style={{ fontWeight: "600" }}>
                      <FaUser style={{ marginRight: "8px" }} />
                      {user.Name.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-center">
                      ₹{user.presentValue}
                    </TableCell>
                    <TableCell className="text-center">₹{user.Gold}</TableCell>
                    <TableCell
                      className="text-center"
                      style={{
                        color:
                          user.quarterlyReturn < 5
                            ? red[500]
                            : user.quarterlyReturn < 10
                            ? yellow[700]
                            : green[500],
                      }}
                    >
                      {user.quarterlyReturn}%
                    </TableCell>
                    <TableCell className="text-center">
                      ₹{user.billableAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
