import React, { useState } from 'react';
import { TextField, Button, Stack, Typography, CircularProgress } from '@mui/material';
import AppVM from '@context/appVM';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgotpassword',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }), }
      );
      const data = await response.json();
      AppVM.showAlert(data.message, response.ok ? 'success' : 'error');
      if (response.ok) { router.push('/auth'); }
    } catch (error) {
      AppVM.showAlert('An error occurred. Please try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <Stack spacing={3} width="100%" maxWidth="400px" margin="auto" mt={5}>
      <Typography variant="h4">Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default ForgotPassword;

