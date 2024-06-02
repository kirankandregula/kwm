import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ClipLoader } from "react-spinners";
import { BsPersonFill, BsLockFill } from "react-icons/bs"; // Import Bootstrap icons
import { useData } from "./DataProvider"; // Adjust the import path as necessary

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    userName: "",
    passWord: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["userName", "userRole", "userId"]);
  const [loading, setLoading] = useState(false);
  const { financialData } = useData(); // Use the financialData from the context

  useEffect(() => {
    if (cookies.userName && cookies.userRole && cookies.userId) {
      navigate(`/portfolio/${cookies.userId}`);
    }
  }, [cookies, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const user = financialData.find(
      (u) =>
        u.Name.toLowerCase() === credentials.userName.toLowerCase() &&
        u.Password === credentials.passWord
    );

    if (user) {
      setCookie("userName", user.Name, { path: "/" });
      setCookie("userRole", user.Role, { path: "/" });
      setCookie("userId", user.user_id, { path: "/" });
      navigate(`/portfolio/${user.user_id}`);
    } else {
      setErrorMessage("Invalid username or password");
    }

    setLoading(false);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ marginTop: "80px" }}
    >
      <div className="card w-75">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">User Login</h2>
          {errorMessage && (
            <p className="text-center text-danger">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <BsPersonFill />
                </span>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={credentials.userName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Username"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <BsLockFill />
                </span>
                <input
                  type="password"
                  id="passWord"
                  name="passWord"
                  value={credentials.passWord}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ backgroundColor: "black", color: "white" }}
            >
              {loading && <ClipLoader color={"#ffffff"} size={20} />} Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
