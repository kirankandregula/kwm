import React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";

const PEFilter = ({ peFilterEnabled, handlePeFilterChange }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={peFilterEnabled}
          onChange={handlePeFilterChange}
          color="primary"
        />
      }
      label="Apply PE Filter"
    />
  );
};

export default PEFilter;
