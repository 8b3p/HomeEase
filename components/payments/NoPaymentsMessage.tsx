import React from 'react';
import { Stack, Typography, useTheme } from '@mui/material';

const NoPaymentsMessage: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack height="100%" width="100%" justifyContent="center" alignItems="center" sx={{ padding: theme.spacing(4) }} >
      <Typography variant="h6">No Payments Found</Typography>
    </Stack>
  );
};

export default NoPaymentsMessage;

