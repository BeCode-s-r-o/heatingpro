import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = '', cancelText }) {
  const confirmActionAndClose = () => {
    onConfirm();
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: 'pre-line' }} id="alert-dialog-description">
          {message.split('<br/>').join('\n')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {confirmText && (
          <Button
            className="whitespace-nowrap w-fit mb-2 mr-8"
            variant="contained"
            color="primary"
            autoFocus
            onClick={confirmActionAndClose}
          >
            {confirmText}
          </Button>
        )}
        <Button className="whitespace-nowrap w-fit mb-2 mr-4" variant="contained" color="secondary" onClick={onClose}>
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
