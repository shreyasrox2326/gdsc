const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
require('dotenv').config(); // Ensure this is at the top

const app = express();
const port = process.env.PORT || 3000;

// Retrieve MongoDB URI from environment variable
const uri = process.env.MONGODB_URI;

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

    try {
        await client.connect();
        const database = client.db('mydatabase'); // Replace with your database name
        const collection = database.collection('submissions'); // Replace with your collection name
        await collection.insertOne(formData);
        res.send(`
            <h1>Submission received successfully!</h1>
            <button onclick="window.location.href='http://localhost:3000';" style="padding: 10px 20px; border-radius: 5px; background-color: #2563eb; color: #fff; border: none; cursor: pointer;">
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
