const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const db = require('./db');
const uuid = require('uuid');

const generateRandomId = () => uuid.v4();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/status', (req, res) => {
  console.log(req.params);
  return res.send(`Test API is running on port ${port}`).status(200);
});

app.post('/excuse', async (req, res) => {
  const {caption, category} = req.body;
  
  if (caption && category) {
    const result = await db.query({
      text: 'INSERT INTO excuses(id, caption, category) VALUES($1, $2, $3) RETURNING *',
      values: [generateRandomId(), caption, category],
    })
    .catch(err => {
      console.log(err.message)
    });

    if (result) {
      console.log(`Excuse "${result.rows[0].caption}" added to database`);
      return res.json({ status: 'success' }).status(200);
    }
  }

  return res.json({ status: 'failed' }).status(200);
});

app.get('/excuse', async (req, res) => {
  const results = await db.query({
    text: 'SELECT * FROM excuses',
  });
  console.log(results.rows);
  const excuse = results.rows[Math.floor(Math.random() * (results.rows.length))].caption;
  return res.json({ excuse }).status(200);
});

app.listen(port, () => console.log(`Example API listening on port ${port}!`));
