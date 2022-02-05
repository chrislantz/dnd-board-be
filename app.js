const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  return res.send('Hello world');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port: ${port}`);
});
