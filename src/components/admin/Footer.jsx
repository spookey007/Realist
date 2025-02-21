// src/components/Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ p: 2, bgcolor: 'background.default', textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
