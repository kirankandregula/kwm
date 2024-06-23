import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const ConfirmationDialog = ({
  open,
  handleCloseConfirmation,
  handleConfirmGenerateAdvice,
}) => (
  <Dialog
    open={open}
    onClose={handleCloseConfirmation}
    aria-labelledby="confirmation-dialog-title"
    aria-describedby="confirmation-dialog-description"
  >
    <DialogTitle id="confirmation-dialog-title">Confirm Generation</DialogTitle>
    <DialogContent>
      <DialogContentText id="confirmation-dialog-description">
        Please share a screenshot after the transaction is completed. That will
        be helpful for future advice.
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

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseConfirmation: PropTypes.func.isRequired,
  handleConfirmGenerateAdvice: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
