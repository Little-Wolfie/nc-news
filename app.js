const express = require('express');
const controllers = require('./controllers/app.controllers');

const app = express();

// some console feedback for when using the app from a terminal
app.use((req, res, next) => {
	const { method, url } = req;
	console.log(`
  METHOD: ${method}
  URL: ${url}
  TIMESTAMP: ${new Date().toUTCString()}
  `);
	next();
});

app.get('/api/topics', controllers.getTopics);

app.use((err, req, res, next) => {
	console.log(err);
});

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Resource not found' });
});

module.exports = app;
