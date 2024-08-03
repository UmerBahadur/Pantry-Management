'use client';
import { firestore, auth } from "@/firebase";
import { useState, useEffect } from "react";
import { Box, Button, Stack, TextField, Typography, Modal } from "@mui/material";
import { collection, query, getDocs, deleteDoc, setDoc, getDoc, doc, orderBy } from "firebase/firestore";
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs'; // Import dayjs for date formatting

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); // New state for expiry date
  const [quantity, setQuantity] = useState(''); // New state for quantity
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(''); // New state for user email
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email || ''); // Set user email
        updateInventory(user.uid);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchQuery]);

  const updateInventory = async (userId) => {
    if (!userId) return;
    const inventoryRef = collection(firestore, 'users', userId, 'inventory');
    const q = query(inventoryRef, orderBy('expiryDate')); // Query ordered by expiry date
    const querySnapshot = await getDocs(q);
    
    const inventoryList = [];
    querySnapshot.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    setInventory(inventoryList);
  };

  const addItem = async () => {
    if (!userId || !itemName || !expiryDate || !quantity) return;

    const itemRef = doc(collection(firestore, 'users', userId, 'inventory'), itemName);
    const itemSnap = await getDoc(itemRef);
    
    if (itemSnap.exists()) {
      const currentQuantity = itemSnap.data().quantity;
      await setDoc(itemRef, { quantity: currentQuantity + parseInt(quantity), expiryDate });
    } else {
      await setDoc(itemRef, { quantity: parseInt(quantity), expiryDate });
    }

    await updateInventory(userId);
    handleClose();
  };

  const removeItem = async (item) => {
    if (!userId) return;
    const itemRef = doc(collection(firestore, 'users', userId, 'inventory'), item.id);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      const { quantity } = itemSnap.data();
      if (quantity > 1) {
        await setDoc(itemRef, { quantity: quantity - 1 });
      } else {
        console.log('Use Edit modal to delete item');
      }
    }
    await updateInventory(userId);
  };

  const deleteItem = async () => {
    if (!userId || !editItem) return;

    const itemRef = doc(collection(firestore, 'users', userId, 'inventory'), editItem.id);
    await deleteDoc(itemRef);

    await updateInventory(userId);
    handleClose();
  };

  const handleOpen = () => {
    setEditMode(false);
    setOpen(true);
  };
  const handleClose = () => {
    setItemName('');
    setExpiryDate('');
    setQuantity('');
    setOpen(false);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setItemName(item.id);
    setExpiryDate(item.expiryDate);
    setQuantity(item.quantity);
    setEditMode(true);
    setOpen(true);
  };

  const saveEdit = async () => {
    if (!userId || !editItem) return;

    const itemRef = doc(collection(firestore, 'users', userId, 'inventory'), editItem.id);
    await setDoc(itemRef, { quantity: parseInt(quantity), expiryDate }, { merge: true });
    
    await updateInventory(userId);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const filterInventory = () => {
    if (searchQuery === '') {
      setFilteredInventory(inventory);
    } else {
      const filteredItems = inventory.filter(item =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInventory(filteredItems);
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
        <Box textAlign="center" mt={2}>
          <Typography variant="body1">Logged in as:</Typography>
          <Typography variant="body1" fontWeight="bold">{userEmail}</Typography>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ marginTop: 'auto' }}
          >
            Logout
          </Button>
        </Box>
      </Box>
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            sx={{ transform: 'translate(-50%, -50%)' }}
          >
            <Typography variant="h6">{editMode ? 'Edit Item' : 'Add Item'}</Typography>
            <Stack width="100%" direction="column" spacing={2}>
              <TextField
                variant="outlined"
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                disabled={editMode}
              />
              <TextField
                variant="outlined"
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <TextField
                variant="outlined"
                label="Expiry Date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button variant="outlined" onClick={editMode ? saveEdit : addItem}>
                {editMode ? 'Save' : 'Add'}
              </Button>
              {editMode && (
                <Button variant="outlined" color="error" onClick={deleteItem}>
                  Delete Item
                </Button>
              )}
            </Stack>
          </Box>
        </Modal>
        <Button
          variant="contained"
          onClick={handleOpen}
        >
          Add New Item
        </Button>
        <Box border="1px Solid #333">
          <Box width="1200px" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h3" color="#333">Inventory Items</Typography>
          </Box>
          <Stack width="1200px" height="550px" spacing={2} padding={2}>
            <TextField
              variant="outlined"
              label="Search by Item Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
            <Box display="flex" justifyContent="space-between" padding="10px">
              
              <Typography variant="h6" width="50%" textAlign="center">Item</Typography>
              <Typography variant="h6" width="25%" textAlign="center">Quantity</Typography>
              <Typography variant="h6" width="25%" textAlign="center">Expiry Date</Typography>
              <Typography variant="h6" width="25%" textAlign="center">Alter</Typography>
            </Box>
            {filteredInventory.length > 0 ? (
              filteredInventory.map(({ id, quantity, expiryDate }) => (
                <Box key={id} width="100%" minHeight="80px" maxHeight="80px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" padding={5}>
                  <Typography variant="h5" color="#333" textAlign="center" width="50%" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </Typography>
                  <Typography variant="h5" color="#333" textAlign="center" width="25%">
                    Quantity: {quantity}
                  </Typography>
                  <Typography variant="h5" color="#666" textAlign="center" width="25%">
                    {dayjs(expiryDate).format('D - MM - YYYY')}
                  </Typography>
                  <Stack direction="row" spacing={2} width="25%" justifyContent="right">
                    <Button variant="contained" onClick={() => removeItem({ id, quantity })}>
                      Remove
                    </Button>
                    <Button variant="contained" onClick={() => handleEdit({ id, quantity, expiryDate })}>
                      Edit
                    </Button>
                  </Stack>
                </Box>
              ))
            ) : (
              <Typography variant="h6" textAlign="center" color="error">
                No such item present in the inventory
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
