'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { firestore, auth } from "@/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import runChat from '@/app/gemini'; // Import the Gemini API function

export default function RecipePage() {
  const [inventory, setInventory] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        updateInventory(user.uid);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const updateInventory = async (userId) => {
    if (!userId) return;
    try {
      const inventoryRef = collection(firestore, 'users', userId, 'inventory');
      const q = query(inventoryRef, orderBy('expiryDate'));
      const querySnapshot = await getDocs(q);
      
      const inventoryList = [];
      querySnapshot.forEach((doc) => {
        inventoryList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setInventory(inventoryList);
      fetchRecipes(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchRecipes = async (inventoryList) => {
    try {
      const itemsString = inventoryList.map(item => item.id).join(", ");
      const prompt = `Give recipes links for the following ingredients: ${itemsString}.`;
      
      const result = await runChat(prompt);
  
      // Debugging output to check the raw result
      console.log('Chat result:', result);
  
      const recipesList = result.split('\n').filter(recipe => recipe).map((recipe, index) => {
        // Split on ': ' if the format is "name: link"
        const [name, link] = recipe.split(': ').map(part => part.trim());
  
        // Filter out entries enclosed in '**'
        if (name.startsWith('**') && name.endsWith('**')) {
          return null;
        }
  
        // Ensure the link is properly formatted
        const formattedLink = link && link.startsWith('http') ? link : '#';
  
        return { name: name || `Recipe ${index + 1}`, link: formattedLink };
      }).filter(recipe => recipe !== null); // Remove null entries
  
      setRecipes(recipesList);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
    >
      <Box
        width="250px"
        height="100%"
        bgcolor="#ADD8E6"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        padding={2}
      >
        <Stack spacing={2}>
          <Button
            variant="contained"
            onClick={() => router.push('/inventory')}
          >
            Inventory Items
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/recipe')}
          >
            Recipes
          </Button>
        </Stack>
        <Button
          variant="contained"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        <Typography variant="h2" color="#333" marginBottom={2}>
          Recipes for items in your inventory
        </Typography>
        <TableContainer component={Paper} style={{ width: '90%', maxWidth: '1200px', marginTop: '16px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">Recipe Name</Typography></TableCell>
                <TableCell align="right"><Typography variant="h6">Action</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes.map((recipe, index) => (
                <TableRow key={index}>
                  <TableCell>{recipe.name}</TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      href={recipe.link} 
                      target="_blank"
                    >
                      View Recipe
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
