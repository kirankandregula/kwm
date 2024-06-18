import React from "react";
import { Container, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Grid } from "@mui/material";
import { styled } from "@mui/system";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
  padding: theme.spacing(2),
  background: "linear-gradient(45deg, #ADD8E6, #ffc3a0)",
  borderRadius: "20px",
  textAlign: "center",
}));

const ContactDetails = styled(Paper)(({ theme }) => ({
  background: "#f2f2f2",
  borderRadius: "10px",
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const Contact = () => {
  return (
    <ContactContainer maxWidth="md" sx={{marginTop: "100px"}}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        For any inquiries or assistance, please feel free to contact us via email or phone:
      </Typography>
      <ContactDetails>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <List>
              <ListItem disablePadding sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ListItemText
                  primary="kirankandregulaiiit@gmail.com"
                  primaryTypographyProps={{ variant: "subtitle1" }}
                  secondaryTypographyProps={{ variant: "body1" }}
                  disableTypography
                  inset
                />
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <List>
              <ListItem disablePadding sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ListItemText
                  primary="7989817831"
                  // primaryTypographyProps={{ variant: "subtitle1" }}
                  // secondaryTypographyProps={{ variant: "body1" }}
                  // disableTypography
                  // inset
                />
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </ContactDetails>
    </ContactContainer>
  );
};

export default Contact;
