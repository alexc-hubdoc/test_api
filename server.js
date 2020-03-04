const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/status', (req, res) => {
  console.log(req.params);
  res.send(`Test API is running on port ${port}`);
});

// localhost:5000/greeting?name=alex
app.get('/greeting', (req, res) => {
  if (req.query.name) {
    res.send(`Hello ${req.query.name}`).status(200);
  } 
  res.json({ greeting: 'Why hello there!' }).status(200);
})

app.get('/greeting/:name', (req, res) => {
  if (req.params) {
    console.log('PARAM: ', req.params);
  }
  res.send(`This is your param: ${req.params.name}`).status(200);
})

app.post('/test', (req, res) => {
  console.log('Request Body: ', req.body);
  res.json({ test_response: 'Hello from test post route' }).status(200);
})

app.listen(port, () => console.log(`Example API listening on port ${port}!`))