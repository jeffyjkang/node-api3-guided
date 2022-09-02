const express = require('express'); // importing a CommonJS module
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());
server.use(cors());
server.use(morgan('tiny'));
server.use(helmet());
// server.use(logger);

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h2>Hubs API</h2>
    <p>Welcome to the Hubs API</p>
  `);
});

server.use('*', (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});

module.exports = server;

// function logger (req, res, next) {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// }