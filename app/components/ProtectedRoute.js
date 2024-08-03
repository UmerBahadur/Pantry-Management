'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        router.push('/login'); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return authenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
