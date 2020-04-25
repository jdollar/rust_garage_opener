import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from '@material-ui/core';

function onIPChange({ setIpAddress }) {
  return function(event) {
    setIpAddress(event.target.value);
  }
}

function onPortChange({ setPort }) {
  return function(event) {
    setPort(event.target.value);
  };
}

export function SetupDialog(props) {
  const { open, setOpen, values, setValues } = props;

  const [ip, setIpAddress] = useState('');
  const [port, setPort] = useState('');

  const handleClose = () => {
    setOpen(false);
  }

  const handleCloseAndSave = () => {
    setValues({ ip, port });
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Setup
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To enable communication to the garage opener, enter it's IP address in the below text box
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="IP Address"
          defaultValue={values.ip}
          fullWidth
          onChange={onIPChange({ setIpAddress })}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Port"
          defaultValue={values.port}
          fullWidth
          onChange={onPortChange({ setPort })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCloseAndSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
