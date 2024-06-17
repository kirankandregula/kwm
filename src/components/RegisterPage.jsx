import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import "../css/RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Password: "",
    Role: "Viewer", // Default role
    Previous_Value: "0",
    Debt: "",
    Gold: "0", // Default value
    approved: "no", // Default approved status
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle

  useEffect(() => {
    // Fetch the user data to determine the new user_id
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbymorTjnVzmJr56gY5zoBlD-dUp8bwC-dYwIKdAm2WRjnfpwjgMLpUut9E15rgCbXah/exec"
        );
        const users = await response.json();
        const maxUserId = users.reduce((max, user) => Math.max(max, user.user_id), 0);
        setFormData((prevData) => ({ ...prevData, user_id: maxUserId + 1 }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { Name, Password, Debt } = formData;

    if (Name.length < 4) {
      setErrorMessage("Username must be at least 4 characters long.");
      return false;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(Password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and contain at least one number and one special character."
      );
      return false;
    }

    if (Number(Debt) < 25000) {
      setErrorMessage("Liquid Fund must be at least 25000.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Set Previous_Value to be the same as Debt
    const updatedFormData = { ...formData, Previous_Value: formData.Debt };
    
    console.log("Register Object: ", updatedFormData); // Log the form data

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxX4X5wPezzCIexzN9yOXzKpqRNrqqIUoSvoHV1u1AeiQK6LJZrFsICFljF1p90SXJM1Q/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      const result = await response.json();
      if (result.success) {
        navigate(`/login`);
      } else {
        setErrorMessage("Registration failed");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setErrorMessage("Registration failed");
    }

    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center" style={{marginTop: "100px"}}>
      <div className="register-card">
        <div className="register-card-body">
          <Typography
            variant="h5"
            align="left"
            sx={{ mb: 3 }}
            style={{ color: "black" }}
            gutterBottom
          >
            Register
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
                  value={formData.Name}
                  onChange={handleChange}
                  name="Name"
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
                  value={formData.Password}
                  onChange={handleChange}
                  name="Password"
                  autoComplete="new-password"
                  label="Password"
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
                />
              </FormControl>
            </div>
            <div className="mb-3">
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-debt">
                  Liquid Fund
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-debt"
                  type="number"
                  value={formData.Debt}
                  onChange={handleChange}
                  name="Debt"
                  autoComplete="new-debt"
                  label="Liquid Fund"
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
              {!loading && "Register"}
            </Button>
          </form>
          <Box mt={2} textAlign="center">
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate("/login")}
            >
              Already have an account?
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
