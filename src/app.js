const express = require('express');
const logger = require('morgan');

const app = express();

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  next();
});

app.use(express.json());
app.use(logger('tiny'));

app.post("/c",  require("./controllers/ShortRoutes").shortRoute)
app.get("/:ext", require("./controllers/ShortRoutes").redirectToUrl)

// handler routers not found
app.use((req, res, next) => {
    res.status(404).json({
      error: "Endpoint not Found",
      endpoint: req.originalUrl,
    });
});

app.use(logger('dev'));

module.exports = app;