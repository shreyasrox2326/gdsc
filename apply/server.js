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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Input Guidelines</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2563eb;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .allowed-chars {
            background-color: #e5e7eb;
            padding: 15px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.4;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #1e40af;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Input Guidelines</h1>
        <p>Please use only the following characters in your input:</p>
        <div class="allowed-chars">
            <strong>Allowed characters:</strong><br>
            - Letters (A-Z, a-z)<br>
            - Digits (0-9)<br>
            - Punctuation marks (. , ! ? ; : ' " ( ) [ ] { } - _)<br>
            - Whitespace (space, tab, newline)
        </div>
        <p>Special characters outside these are not allowed.</p>
        <a href="https://gdsc-neon-zeta.vercel.app/" class="button">Go Back to Form</a>
    </div>
</body>
</html>
        `);
    }

    try {
        await client.connect();
        const database = client.db('mydatabase'); // Replace with your database name
        const collection = database.collection('submissions'); // Replace with your collection name
        await collection.insertOne(formData);
        res.send(`
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submission Successful</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #10b981;
            font-size: 28px;
            margin-bottom: 20px;
        }
        .icon {
            font-size: 64px;
            color: #10b981;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .button:hover {
            background-color: #1e40af;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✅</div>
        <h1>Submission received successfully!</h1>
        <p>Thank you for your submission. We have received your information.</p>
        <button onclick="window.location.href='https://gdsc-neon-zeta.vercel.app/';" class="button">
            Go Back to Form
        </button>
    </div>
</body>
</html>
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
