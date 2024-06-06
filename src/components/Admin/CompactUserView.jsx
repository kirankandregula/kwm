import React from "react";
import { green, red, yellow } from "@mui/material/colors";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";

const CompactUserView = ({ userData, handleRowClick }) => (
  <Box className="compact-stock-container" sx={{ mb: 10,mt: 8, width: "100%" }}>
    {userData.map((user, index) => (
      <Box
        key={index}
        className="compact-stock-view"
        onClick={() => handleRowClick(user.user_id)}
        sx={{
          cursor: "pointer",
          mb: 1,
          p: 2,
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "100%",
        }}
      >
        <Grid container alignItems="center" className="stock-header">
          <Grid item xs={12} className="stock-details">
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="caption">
                  PE. {user.averagePE}{" "}
                  <span style={{ marginLeft: "1px" }}></span>Ex-Gth.{" "}
                  {user.averageScopeToGrow}%
                </Typography>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      user.quarterlyReturn < 5
                        ? red[500]
                        : user.quarterlyReturn < 10
                        ? yellow[700]
                        : green[500],
                  }}
                >
                  {user.quarterlyReturn}%
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container alignItems="center" className="stock-header">
          <Grid item xs={12} className="stock-details">
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>{user.Name.toUpperCase()}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Typography variant="body2" className="stock-name">
                  <strong> ₹{user.presentValue}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container className="stock-details">
          <Grid item xs={6} style={{ textAlign: "left" }}>
            <Typography variant="caption">
              Debt: {user.Debt} Gold: {user.Gold}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Typography variant="caption">
              Bill: {user.billableAmount}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    ))}
  </Box>
);

export default CompactUserView;
