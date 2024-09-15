const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
require('dotenv').config(); // Ensure this is at the top

const app = express();
const port = process.env.PORT || 3000;

// Retrieve MongoDB URI from environment variable
const uri = process.env.MONGODB_URI;

// Check if the URI is defined
if (!uri) {
    console.error('MongoDB URI is not defined. Please set the MONGODB_URI environment variable.');
    process.exit(1);
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Middleware to parse POST request body data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML form file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'shreyas.html'));
});

// Fetch and return past submissions as JSON
app.get('/submissions', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('mydatabase'); // Replace with your database name
        const collection = database.collection('submissions'); // Replace with your collection name
        const submissions = await collection.find().toArray();
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    } finally {
        await client.close();
    }
});

// Handle form submissions
app.post('/submit', async (req, res) => {
    const formData = req.body;
    const userInput = formData.userInput;

    console.log('Received input:', userInput); // Log received input

    // Regular expression to match allowed characters: alphabets, numbers, and basic punctuation
    const regex = /^[A-Za-z0-9.,!?;:'"()[\]{}\-_\s]*$/;

    // Validate input
    if (!regex.test(userInput)) {
        console.log('Invalid input detected.'); // Log if input is invalid
        return res.status(400).send(`
            <h1>Invalid input. Please use only alphabets, numbers, and basic punctuation characters.</h1>
            <button onclick="window.location.href='https://gdsc-neon-zeta.vercel.app/';" style="padding: 10px 20px; border-radius: 5px; background-color: #2563eb; color: #fff; border: none; cursor: pointer;">
                Go Back to Form
            </button>
        `);
    }

    try {
        await client.connect();
        const database = client.db('mydatabase'); // Replace with your database name
        const collection = database.collection('submissions'); // Replace with your collection name
        await collection.insertOne(formData);
        res.send(`
            <h1>Submission received successfully!</h1>
            <button onclick="window.location.href='https://gdsc-neon-zeta.vercel.app/';" style="padding: 10px 20px; border-radius: 5px; background-color: #2563eb; color: #fff; border: none; cursor: pointer;">
                Go Back to Form
            </button>
        `);
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).send('Error saving data');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
