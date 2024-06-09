import React from "react";
import { Button } from "@mui/material";
import { FaSync } from "react-icons/fa";

const RefreshButton = ({ handleClick }) => (
  <Button
    variant="contained"
    color="primary"
    startIcon={<FaSync />}
    onClick={handleClick}
    sx={{mt: 10}}
  >
    Refresh Data
  </Button>
);

export default RefreshButton;
