import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const DesktopModal = ({ onClose }) => {
  return (
    <Modal open onClose={onClose}>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: '16px', width: '50%', maxWidth: '600px', mx: 'auto', mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Users Desktop Modal
        </Typography>
        <Button fullWidth onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default DesktopModal;