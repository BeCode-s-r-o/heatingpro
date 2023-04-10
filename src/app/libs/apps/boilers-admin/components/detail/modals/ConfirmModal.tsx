import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText, cancelText }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button className="whitespace-nowrap w-fit mb-2 mr-4" variant="contained" onClick={onClose}>
          {cancelText}
        </Button>
        <Button
          className="whitespace-nowrap w-fit mb-2 mr-8"
          variant="contained"
          color="secondary"
          autoFocus
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
