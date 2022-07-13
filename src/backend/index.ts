const express = require('express');
var cors = require('cors')
const api = require('./api');

const app = express();

var allowlist = ['http://localhost:3000', 'https://staging.pdd.myatnenko.ru']

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

app.use(express.json());

app.use('/api/v1', api);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});