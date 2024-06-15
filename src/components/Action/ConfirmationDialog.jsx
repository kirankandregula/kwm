import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const ConfirmationDialog = ({
  confirmationOpen,
  handleCloseConfirmation,
  handleConfirmGenerateAdvice,
}) => (
  <Dialog
    open={confirmationOpen}
    onClose={handleCloseConfirmation}
    aria-labelledby="confirmation-dialog-title"
    aria-describedby="confirmation-dialog-description"
  >
    <DialogTitle id="confirmation-dialog-title">Confirm Generation</DialogTitle>
    <DialogContent>
      <DialogContentText id="confirmation-dialog-description">
        Please share a screenshot after the transaction is completed. That will
        be helpful for future advice
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseConfirmation} color="primary">
        Cancel
      </Button>
      <Button onClick={handleConfirmGenerateAdvice} color="primary" autoFocus>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;
