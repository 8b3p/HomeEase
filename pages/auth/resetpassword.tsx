import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Stack, Typography } from '@mui/material';
import AppVM from '@context/appVM';

const ResetPassword = () => {
  const router = useRouter();
  const { token, email } = router.query;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { AppVM.showAlert('Passwords do not match', 'error'); return; }
    try {
      const response = await fetch('/api/auth/resetpassword',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, email, newPassword }), }
      );
      const data = await response.json();
      AppVM.showAlert(data.message, response.ok ? 'success' : 'error');
      if (response.ok) { router.push('/auth'); }
    } catch (error) {
      AppVM.showAlert('An error occurred. Please try again.', 'error');
    }
  };

  return (
    <Stack spacing={3} width="100%" maxWidth="400px" margin="auto" mt={5}>
      <Typography variant="h4">Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default ResetPassword;

