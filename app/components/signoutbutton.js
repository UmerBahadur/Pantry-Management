// app/components/SignOutButton.js
'use client'
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Button variant="contained" onClick={handleSignOut}>Sign Out</Button>
  );
};

export default SignOutButton;
