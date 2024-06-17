import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ClipLoader } from "react-spinners";
import { BsPersonFill } from "react-icons/bs";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Button,
  Box
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useData } from "./dataprovider/DataProvider"; // Adjust the import path as necessary
import "../css/Loginpage.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    userName: "",
    passWord: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["userName", "userRole", "userId"]);
  const [loading, setLoading] = useState(false);
  const { fetchData } = useData();

  useEffect(() => {
    if (cookies.userName && cookies.userRole && cookies.userId) {
      navigate(`/portfolio/${cookies.userId}`);
    }
  }, [cookies, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby5GfxI1JMefqrVXYHMaodj07Dbx1MOTY8O_gu1U14ceiqdZzbN42ZX9KCmi_J0ZJJL/exec"
      );

      const users = await response.json();

      const user = users.find(
        (user) =>
          user.Name === credentials.userName.trim() &&
          user.Password === credentials.passWord
      );

      if (user) {
        if (user.approved === "yes") {
          const expirationTime = new Date(new Date().getTime() + 30 * 60 * 1000);
          setCookie("userName", user.Name, { expires: expirationTime });
          setCookie("userRole", user.Role, { expires: expirationTime });
          setCookie("userId", user.user_id, { expires: expirationTime });

          await fetchData();
          navigate(`/portfolio/${user.user_id}`);
        } else {
          setErrorMessage("Your account is not approved. Please contact the Admin.");
        }
      } else {
        setErrorMessage("Invalid username or password");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-card">
        <div className="login-card-body">
          <Typography
            variant="h5"
            align="left"
            sx={{ mb: 3 }}
            style={{ color: "black" }}
            gutterBottom
          >
            Login
          </Typography>
          {errorMessage && (
            <p className="text-center text-danger">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-username">
                  Username
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-username"
                  type="text"
                  value={credentials.userName}
                  onChange={handleChange}
                  name="userName"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <BsPersonFill style={{ color: "#757575" }} />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Username"
                />
              </FormControl>
            </div>
            <div className="mb-3">
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.passWord}
                  onChange={handleChange}
                  name="passWord"
                  autoComplete="current-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              style={{ borderRadius: "0px", height: "45px" }}
            >
              {loading && <ClipLoader color={"#ffffff"} size={20} />}
              {!loading && "Login"}
            </Button>
          </form>
          <Box mt={2} textAlign="center">
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate("/register")}
            >
              Are you a New User?
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
