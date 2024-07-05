import express from 'express';
import dotenv from 'dotenv';
import Anthropic from "@anthropic-ai/sdk";
import getImageBase64 from './utils/base64.js';

// routes
import prescriptionRoutes from './routes/prescriptionRouter.js';
import chatRoutes from './routes/chat.js';
import emergencyRoutes from './routes/emergencyContact.js'
import emergencyRoutes2 from './routes/emergencyContacts2.js'

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 3000;

console.log(`Server will run on port: ${PORT}`);

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});


// Use the prescription routes
app.use('/api/prescription', prescriptionRoutes);

app.use("/api/chat", chatRoutes)

app.use("/api/emergency", emergencyRoutes)

app.use("/api/emergency2", emergencyRoutes2)


// Basic route
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
