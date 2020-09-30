const express = require('express'); // importing a CommonJS module
const morgan = require('morgan');
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();
const logger = morgan('combined');

// global middleware
function greeter(req, res, next) {
  console.log('hello');

  req.name = 'sam';

  next();
}

function passwordValid(req, res, next) {
  if (req.headers.password === 'melon') {
    next();
  } else {
    res.status(401).json({ errorMessage: 'Incorrect password' });
  }
}

server.use(express.json());
server.use(logger);
server.use(greeter);
// server.use(passwordValid);

server.get('/', (req, res) => {
  const password = req.headers.password;
  const nameInsert = req.name ? ` ${req.name}` : '';

  res.status(200).json({ name: nameInsert, password });
});

server.use('/api/hubs', passwordValid, hubsRouter);

module.exports = server;
