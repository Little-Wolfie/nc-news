const express = require('express');
const controllers = require('./controllers/app.controllers');
const errorHandlers = require('error-handlers.js');

const app = express();

app.get('/api/topics', controllers.getTopics);

app.use((err, req, res, next) => {
	errorHandlers.handleUncaughtError(err);
});

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Resource not found' });
});

module.exports = app;
