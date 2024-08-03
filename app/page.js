'use client'
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';

const HomePage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login'); // Navigate to the login page
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h2">Pantry Tracker</Typography>
      <Typography variant="h6">Keep track of your inventory | Manage Inventory | Always be updated</Typography>
      <Button variant="contained" onClick={handleGetStarted}>Get Started</Button>
    </Box>
  );
};

export default HomePage;
