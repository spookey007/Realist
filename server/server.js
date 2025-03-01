import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './db/index.js'; // Import the testConnection function
import routes from './routes/index.js'; // Import your routes

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config(); // Load environment variables from .env file

app.use(cors({
  origin: '*', // Allows requests from any origin
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static file serving

const distPath = path.join(__dirname, "../dist"); // Adjust if needed

app.use(express.static(distPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(distPath, "index.html"));
// })
// Use routes
app.use('/api', routes);
app.use((req, res, next) => {
  console.log('Main middleware reached');
  next();
});

// Test the database connection
testConnection(); // Call the function to test the database connection


export default app;