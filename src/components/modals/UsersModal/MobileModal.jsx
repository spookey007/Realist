import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const MobileModal = ({ onClose }) => {
  return (
    <Modal open onClose={onClose}>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: '16px', width: '90%', maxWidth: '400px', mx: 'auto', mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Users Mobile Modal
        </Typography>
        <Button fullWidth onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default MobileModal;