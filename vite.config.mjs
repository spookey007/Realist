import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import 'alertifyjs/build/css/alertify.css';`
      }
    }
  },
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'), // Set NODE_ENV
  },
  build: {
    // Set a custom chunk size warning limit (optional)
    chunkSizeWarningLimit: 1000, // Adjust to your desired limit in kB

    rollupOptions: {
      output: {
        // Manual chunking
        manualChunks(id) {
          // Separate node_modules into their own chunks
          if (id.includes('node_modules')) {
            return id.split('node_modules/')[1].split('/')[0].toString(); // Split by the package name
          }
          // You can also create custom chunks for specific modules
          if (id.includes('src/components')) {
            return 'components'; // All components in a single chunk
          }
        },
      },
    },
  },
  server: {
    port: 3131,
  },
  preview: {
    port: 5101,
  },
});
