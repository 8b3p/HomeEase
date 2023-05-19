import { Alert, AlertProps, Button, Snackbar } from '@mui/material';
import React from 'react';


const GlobalAlert = ({ message, severity, action }: {
  message: string, severity: AlertProps['severity'], action?: {
    icon: JSX.Element,
    action: () => void
  }
}) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = (_event: Event | React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert action={action ? (<Button onClick={action.action}>{action.icon}</Button>) : undefined} onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default GlobalAlert
