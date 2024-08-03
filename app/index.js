// app/index.js or another navigation component
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const Navigation = () => {
  const router = useRouter();

  return (
    <Box>
      <Typography variant="h4">Welcome to the Pantry Management App</Typography>
      <Button onClick={() => router.push('/signup')}>Sign Up</Button>
      <Button onClick={() => router.push('/login')}>Login</Button>
    </Box>
  );
};

export default Navigation;
