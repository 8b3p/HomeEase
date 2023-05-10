import { Alert, AlertProps, Snackbar, Stack } from '@mui/material';
import React from 'react';


const GlobalAlert = ({ message, severity }: { message: string, severity: AlertProps['severity'] }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = (_event: Event | React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default GlobalAlert
