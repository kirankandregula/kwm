import React from "react";
import { green, red } from "@mui/material/colors";
import { Box, Typography, Grid } from "@mui/material";

const CompactUserView = ({ userData, handleRowClick }) => (
  <Box className="compact-stock-container" sx={{ mb: 8, mt: 8, width: "100%" }}>
    {userData.map((user, index) => (
      <Box
        key={index}
        className="compact-stock-view"
        onClick={() => handleRowClick(user.user_id)}
        sx={{
          cursor: "pointer",
          mb: 1,
          p: 1,
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "100%",
        }}
      >
        <Grid container alignItems="center" className="stock-header">
          <Grid item xs={12} className="stock-details">
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="caption">
                  PE. {!isNaN(user.averagePE)? (user.averagePE): 0}
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ mx: 0.5 }}
                  >
                    &bull;
                  </Typography>
                  Gwth. {!isNaN(user.averageScopeToGrow) ? (user.averageScopeToGrow) : 0}%
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body2"
                  sx={{
                    color: user.quarterlyReturn < 0 ? red[500] : green[500],
                    fontWeight: "bold",
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
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="body2">
                  <strong>{user.Name.toUpperCase()}</strong>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" className="stock-name">
                  <strong>₹{user.presentValue}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container className="stock-details">
          <Grid item xs={6}>
            <Typography variant="caption">
              Debt. {user.Debt}{" "}
              <Typography variant="caption" component="span" sx={{ mx: 0.5 }}>
                &bull;
              </Typography>
              Gold. {user.Gold}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Typography variant="caption">
              Bill. {user.billableAmount}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    ))}
  </Box>
);

export default CompactUserView;
