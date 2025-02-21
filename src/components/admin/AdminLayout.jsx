// src/components/admin/AdminLayout.jsx
import React from 'react';
import { Box } from '@mui/material'; // Ensure you have Material-UI installed
import Header from './Header'; // Adjust path if necessary
import Sidebar from './Sidebar'; // Your Sidebar component for admin
import Footer from './Footer'; // Optional, if you have a Footer

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box 
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          color: 'black',
        }}
        >
        {children}
      </Box>
      <Footer /> {/* Optionally render Footer for Admin layout */}
    </Box>
  );
};

export default AdminLayout;
