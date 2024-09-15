
# GDSC Submission

This is a simple website designed to collect user inputs via a form and display previous submissions. It looks wonky because I dont know shit about frontend design. The website is hosted on Vercel uses MongoDB to store and fetch the inputs.

https://gdsc-neon-zeta.vercel.app/


## Frontend: 
- Written in HTML with Tailwind CSS.

- I made a carousel style display for all the static text boxes.

- I added a basic input form to accept input from the users. It calls a javascript to do the backend stuff.

- I then added a table to show past entries.

## Backend:
- Written in JS using node.js runtime

- Using MongoDB to store data and get previous entries
 
- The client-side JavaScript manages the following: it implements a carousel for displaying content, makes HTTP GET requests to load past submissions, and sends HTTP POST requests to submit form data.

- The server-side JavaScript connects to a MongoDB database, serves the HTML form, and handles submissions. It also implements the check for valid characters in the input. In order to not reveal my MongoDB admin key to everyone, the script uses environment variables provided by Vercel for connection to the DB.
 

## Development Process

First, I began by creating a clean HTML file for the frontend. I quickly realized that the HTML I had learned in middle school wasn't sufficient for creating a modern-looking website, so I enlisted Claude to handle the frontend design.

Once a basic frontend was in place, I focused on the backend. I used online resources to figure out how to create a basic HTML form and handle its responses using JavaScript. Initially, I decided to store all the responses in a JSON file because it would be easy to parse and manage. I got the submission system working and was also able to display previous submissions.

When it was time to go live, I deployed the website using Vercel. I found Vercel to be quite convenient, especially with its GitHub integration; I just had to push my code, and a new version would be deployed automatically.

After deployment, I encountered several issues. The JSON file was stored on GitHub, which obviously made it inaccessible and caused the submissions to fail. I then attempted to create a Google Cloud Function in Python to handle reading and writing the JSON file, but that just made things worse and was a waste of time. I asked for some advice from a friend who suggested using Firebase or MongoDB. I decided to go with MongoDB and spent an hour trying to sort out permissions and give Vercel access to the database. This was quite funny because the fix was actually super simple: I just needed to go into Vercel’s project settings, choose the MongoDB integration, and it sorted itself out.

Once I had MongoDB working, I decided to improve the frontend design further (something I regret doing). After another hour or two of tweaking, I decided to give up and undo all my changes. I made a new branch from the commit before the redesign began. I set this new branch as the default, and deleted the branch that used to be the main branch which led to a lot of issues. To fix this, I renamed the second branch to be the main branch on GitHub, which caused the local copy of that branch to think that it had'nt been published yet. So, I ended up deleting the local repository and simply cloning it again from GitHub.

That's all.