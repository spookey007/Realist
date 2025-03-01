// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7366FF', // Quixlab's purple-blue
    },
    secondary: {
      main: '#FF6E61', // Quixlab's red
    },
    error: {
      main: '#FF5252', // Error color (Red)
    },
    warning: {
      main: '#FFB400', // Quixlab's Orange
    },
    info: {
      main: '#4099ff', // Quixlab's Blue
    },
    success: {
      main: '#22C55E', // Green
    },
    background: {
      default: '#F8F9FA', // Light gray background
      paper: '#FFFFFF', // White cards
    },
    text: {
      primary: '#333333', // Dark text
      secondary: '#6C757D', // Gray text
    },
  },
  typography: {
    fontFamily: `"Poppins", "Roboto", "Helvetica", "Arial", sans-serif`,
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
    },
  },
});

export default theme;
