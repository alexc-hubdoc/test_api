const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const db = require('./db');
const uuid = require('uuid');

const activeCategories = ['medical', 'social', 'family'];

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

// localhost:5000/greeting?name=alex
app.get('/greeting', (req, res) => {
  if (req.query.name) {
    return res.send(`Hello ${req.query.name}`).status(200);
  } 
  return res.json({ greeting: 'Why hello there!' }).status(200);
})

// localhost:5000/greeting/alex
app.get('/greeting/:name', (req, res) => {
  if (req.params) {
    console.log('PARAM: ', req.params);
  }
  return res.send(`This is your param: ${req.params.name}`).status(200);
})

app.post('/test', (req, res) => {
  console.log('Request Body: ', JSON.stringify(req.body));
  return res.json({ test_response: 'Hello from test post route' }).status(200);
})

app.listen(port, () => console.log(`Example API listening on port ${port}!`))