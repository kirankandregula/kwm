import React from "react";
import { Container, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/system";

const ContactContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(10),
  padding: theme.spacing(2),
  background: "linear-gradient(45deg, #ADD8E6, #ffc3a0)",
  borderRadius: "20px",
}));

const ContactDetails = styled(Paper)(({ theme }) => ({
  background: "#f2f2f2",
  borderRadius: "10px",
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const Contact = () => {
  return (
    <ContactContainer maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body2" align="center" paragraph>
        For any inquiries or assistance, please contact us:
      </Typography>
      <ContactDetails elevation={3}>
        <List>
          <ListItem>
            <ListItemText primary="Email: kirankandregulaiiit@gmail.com" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Mobile: 7989817831" />
          </ListItem>
        </List>
      </ContactDetails>
    </ContactContainer>
  );
};

export default Contact;
