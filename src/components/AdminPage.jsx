import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../App.css";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function AdminPage() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://script.google.com/macros/s/AKfycbymorTjnVzmJr56gY5zoBlD-dUp8bwC-dYwIKdAm2WRjnfpwjgMLpUut9E15rgCbXah/exec"
      );

      const userData = response.data;
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleRowClick = (userId) => {
    // Call another component with the parameter userId
    navigate(`/user-details/${userId}`);
  };
  

  return (
    <div className="container">
      <h1 className="mb-4 text-center" style={{ marginTop: "70px" }}>
        PortFolio Data
      </h1>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        {loading ? (
          // Display spinner while loading
          <div className="sweet-loading">
            <ClipLoader
              color={"#36D7B7"}
              loading={loading}
              css={override}
              size={150}
            />
          </div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr key={index} onClick={() => handleRowClick(user.user_id)}>
                  <td>{user.Name}</td>
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
