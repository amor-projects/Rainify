const express = require('express');
const path = require('path');

const app = require('./api/index.js');
const port = Number(process.env.PORT) || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Rainify is running at http://localhost:${port}`);
});
