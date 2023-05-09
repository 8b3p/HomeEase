import { Alert, AlertProps, Snackbar } from '@mui/material';
import React from 'react';

interface props {
  message: string;
  type: AlertProps['severity'];
}

const GlobalAlert = () => {
  return (
    <Snackbar open={success || error ? true : false} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
        {error ? error : success}
      </Alert>
    </Snackbar>
  )
}

export default GlobalAlert
