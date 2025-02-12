'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import CameraCapture from './CameraCapture'; // Adjust the import path as needed

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [updateItemName, setUpdateItemName] = useState('');
  const [updateQuantity, setUpdateQuantity] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'));
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({ id: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(
      (item) => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const addItem = async (item) => {
    if (!item) {
      console.error('Item name is empty.');
      return;
    }

    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
        console.log(`Existing item ${item} updated with new quantity.`);
      } else {
        await setDoc(docRef, { name: item, quantity: 1 });
        console.log(`New item ${item} added to inventory.`);
      }
      await updateInventory();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
        }
        console.log(`Item ${item} quantity reduced or removed from inventory.`);
      }
      await updateInventory();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCaptureOpen = () => setCaptureOpen(true);
  const handleCaptureClose = () => setCaptureOpen(false);

  const handleUpdateOpen = (item, quantity) => {
    setUpdateItemName(item);
    setUpdateQuantity(quantity);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => setUpdateOpen(false);

  const updateItem = async (item, newQuantity) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      await setDoc(docRef, { quantity: newQuantity }, { merge: true });
      await updateInventory();
      handleUpdateClose();
      console.log(`Item ${item} updated with new quantity.`);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={captureOpen}
        onClose={handleCaptureClose}
        aria-labelledby="capture-modal-title"
        aria-describedby="capture-modal-description"
      >
        <Box sx={style}>
          <CameraCapture />
        </Box>
      </Modal>

      <Modal
        open={updateOpen}
        onClose={handleUpdateClose}
        aria-labelledby="update-modal-title"
        aria-describedby="update-modal-description"
      >
        <Box sx={style}>
          <Typography id="update-modal-title" variant="h6" component="h2">
            Update Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-update-item"
              label="Item"
              variant="outlined"
              fullWidth
              value={updateItemName}
              disabled
            />
            <TextField
              id="outlined-update-quantity"
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              value={updateQuantity}
              onChange={(e) => setUpdateQuantity(parseInt(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => updateItem(updateItemName, updateQuantity)}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>

      <TextField
        id="search-bar"
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Button variant="contained" onClick={handleCaptureOpen}>
        Capture New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ id, name, url, quantity }) => (
            <Box
              key={id}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              {url && (
                <img src={url} alt={name} style={{ height: '100px', marginRight: '20px' }} />
              )}
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Unnamed Item'}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => handleUpdateOpen(name, quantity)}>
                Update
              </Button>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
