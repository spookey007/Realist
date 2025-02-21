// src/components/NotFound.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh', // Default height for most screens
        textAlign: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        p: 3,
        // Adjust height for different screen sizes using breakpoints
        '@media (max-width: 1200px)': {
          height: '75vh',
        },
        '@media (max-width: 900px)': {
          height: '70vh',
        },
        '@media (max-width: 600px)': {
          height: '65vh',
        },
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        It looks like the page you're trying to access is not available or may have been moved.
      </Typography>
      <Button variant="contained" component={Link} to="/" sx={{ textTransform: 'none' }}>
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;
