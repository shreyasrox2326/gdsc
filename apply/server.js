const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse POST request body data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML form file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/shreyas.html'); // Make sure the path to shreyas.html is correct
});

// Handle form submissions
app.post('/submit', (req, res) => {
    const formData = req.body;

    // Read existing data from the JSON file (or create it if it doesn't exist)
    let data = [];
    try {
        const fileData = fs.readFileSync('submissions.json', 'utf8');
        data = JSON.parse(fileData);
    } catch (error) {
        // If file doesn't exist or there's an error, proceed with empty data array
        console.log('No existing file or error reading file, starting fresh.');
    }

    // Append the new form data
    data.push(formData);

    // Write the updated data back to the JSON file
    fs.writeFile('submissions.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error saving data');
        }
        res.send('Form submitted successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
