import React, { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';
import { Button, Box, TextField, Typography } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, firestore } from '../firebase'; // Adjust the path to your firebase.js file
import Compressor from 'compressorjs';

const CameraCapture = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const takePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo);
    setUploadError('');
    setUploadSuccess('');
  };

  const uploadPhoto = async () => {
    if (!image || !imageName) {
      setUploadError('Please capture an image and enter a name.');
      return;
    }

    try {
      // Convert base64 image to Blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Compress the image
      new Compressor(blob, {
        quality: 0.6, // Adjust quality as needed
        success: async (compressedBlob) => {
          // Create a reference to 'images/<imageName>.jpg'
          const storageRef = ref(storage, `images/${imageName}.jpg`);

          // Upload the compressed file to Firebase Storage
          await uploadBytes(storageRef, compressedBlob);

          // Get the download URL
          const downloadURL = await getDownloadURL(storageRef);

          // Save the image URL, name, and initial quantity to Firestore
          await addDoc(collection(firestore, 'inventory'), {
            name: imageName,
            url: downloadURL,
            quantity: 1,
            createdAt: new Date()
          });

          console.log('File available at', downloadURL);
          setUploadSuccess('Image uploaded successfully!');
          setImage(null);
          setImageName('');
        },
        error: (err) => {
          console.error('Error compressing image:', err);
          setUploadError('Failed to compress image. Please try again.');
        },
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Camera ref={camera} aspectRatio={16 / 9} />
      <Button variant="contained" onClick={takePhoto}>Take Photo</Button>
      {image && (
        <>
          <img src={image} alt="Captured" style={{ maxWidth: '100%' }} />
          <TextField
            label="Image Name"
            variant="outlined"
            fullWidth
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />
          <Button variant="contained" onClick={uploadPhoto}>Upload Photo</Button>
          {uploadError && (
            <Typography color="error">{uploadError}</Typography>
          )}
          {uploadSuccess && (
            <Typography color="primary">{uploadSuccess}</Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default CameraCapture;
