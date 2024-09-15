const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection URI (replace with your MongoDB connection string)
const mongoURI = 'mongodb+srv://shreyasrox2326:SoaD5D8in2HLVQw4@cluster0.hyp2a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Update with your MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for form submissions
const submissionSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

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
        const submissions = await Submission.find().exec();
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Handle form submissions
app.post('/submit', async (req, res) => {
    const formData = req.body;

    try {
        const submission = new Submission(formData);
        await submission.save();

        // Send a success message with a button to go back to the main page
        res.send(`
            <h1>Submission received successfully!</h1>
            <button onclick="window.location.href='http://localhost:3000';" style="padding: 10px 20px; border-radius: 5px; background-color: #2563eb; color: #fff; border: none; cursor: pointer;">
                Go Back to Form
            </button>
        `);
    } catch (err) {
        console.error('Error saving submission:', err);
        res.status(500).send('Error saving data');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
