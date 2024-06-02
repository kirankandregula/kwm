// AdminPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useData } from "./DataProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

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
  const { financialData } = useData(); // Changed from DataProvider() to useData()
  useEffect(() => {
    if (financialData) {
      setUserData(financialData);
      setLoading(false);
    }
  }, [financialData]);

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
      <div
        className="d-flex justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        {loading ? (
          <div className="sweet-loading  align-items-center">
            <ClipLoader
              color={"#36D7B7"}
              loading={loading}
              css={override}
              size={150}
            />
          </div>
        ) : (
          <table
            className="table table-striped table-bordered w-50"
            style={{ marginBottom: "100px" }}
          >
            <thead>
              <tr>
                <th>Click on Username for Personal Portfolio:</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(user.user_id)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-center">{user.Name.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
