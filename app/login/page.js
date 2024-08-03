// app/login/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/inventory'); // Redirect to the inventory management page
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignUp = () => {
    router.push('/signup'); // Redirect to the signup page
  };

  const handleHomeRedirect = () => {
    router.push('/'); // Redirect to the home page
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h4">Login</Typography>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={handleLogin}>Login</Button>
      <Button variant="outlined" onClick={handleSignUp}>Sign Up</Button>
      </Stack>
      <Button variant="outlined" onClick={handleHomeRedirect}>Back to Home</Button>
    </Box>
  );
};

export default LoginPage;
