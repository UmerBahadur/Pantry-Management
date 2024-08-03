// app/signup/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Box, Button, TextField, Typography } from '@mui/material';

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/inventory'); // Redirect to the inventory management page
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login'); // Redirect to the login page
  };

  const handleHomeRedirect = () => {
    router.push('/'); // Redirect to the home page
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h4">Sign Up</Typography>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" onClick={handleSignup}>Sign Up</Button>
      <Button variant="outlined" onClick={handleLoginRedirect}>Already have an account? Login</Button>
      <Button variant="outlined" onClick={handleHomeRedirect}>Back to Home</Button>
    </Box>
  );
};

export default SignupPage;
