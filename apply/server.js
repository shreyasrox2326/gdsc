const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
};

// Define a schema and model for form submissions
const submissionSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = async (req, res) => {
    try {
        await connectToDatabase();

        if (req.method === 'GET') {
            const submissions = await Submission.find().exec();
            return res.json(submissions);
        }

        if (req.method === 'POST') {
            const formData = req.body;
            const submission = new Submission(formData);
            await submission.save();
            return res.send(`
                <h1>Submission received successfully!</h1>
                <button onclick="window.location.href='/';" style="padding: 10px 20px; border-radius: 5px; background-color: #2563eb; color: #fff; border: none; cursor: pointer;">
                    Go Back to Form
                </button>
            `);
        }

        res.status(405).send('Method Not Allowed');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
};
