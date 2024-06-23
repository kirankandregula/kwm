import React from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const ContactContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(6),
  padding: theme.spacing(4),
  background: "linear-gradient(45deg, #ADD8E6, #ffc3a0)",
  borderRadius: "20px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const ContactDetails = styled(Paper)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: "10px",
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}));

const ListItemWrapper = styled(ListItem)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
}));

const Contact = () => {
  return (
    <ContactContainer maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        For any inquiries or assistance, please feel free to contact us via
        email or phone:
      </Typography>
      <ContactDetails>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <List>
              <ListItemWrapper disablePadding>
                <ListItemIcon>
                  <WhatsAppIcon color="primary" sx={{ fontSize: 40 }} />
                </ListItemIcon>
                <Box>
                  <ListItemText
                    primary="7989817831"
                    primaryTypographyProps={{ variant: "subtitle1" }}
                  />
                  <ListItemText
                    primary="8096738764"
                    primaryTypographyProps={{ variant: "subtitle1" }}
                  />
                </Box>
              </ListItemWrapper>
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <List>
              <ListItemWrapper disablePadding>
                <ListItemIcon>
                  <EmailIcon color="primary" sx={{ fontSize: 40 }} />
                </ListItemIcon>
                <ListItemText
                  primary="kirankandregulaiiit@gmail.com"
                  primaryTypographyProps={{ variant: "subtitle1" }}
                  secondaryTypographyProps={{ variant: "body1" }}
                  disableTypography
                />
              </ListItemWrapper>
            </List>
          </Grid>
        </Grid>
      </ContactDetails>
    </ContactContainer>
  );
};

export default Contact;
