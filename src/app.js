const express = require('express');
const logger = require('morgan');
const cookieParser = require("cookie-parser");
const app = express();
const rateLimit = require('express-rate-limit');

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(cookieParser());
const limiter = rateLimit({
	windowMs: 60 * 24 * 1000, // 60 minutes
	limit: 100, //Limit request by IP
	standardHeaders: true,
	legacyHeaders: false,
  message: 'Too many requests, please try again later.',
})

app.use(limiter); 

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  next();
});

app.use(express.json());
app.use(logger('tiny'));

// Import routes
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/shortroutes")); 

// Handler 404
app.use((req, res, next) => {
  res.status(404).json({
    error: "Endpoint not Found",
    endpoint: req.originalUrl,
  });
});

app.use(logger('dev'));

module.exports = app;