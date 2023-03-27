const express = require('express');
const controllers = require('./controllers/app.controllers');
const errorHandlers = require('./error-handlers.js');

const app = express();

app.get('/api/topics', controllers.getTopics);
app.get('/api/articles/:article_id', controllers.getArticleById);

app.use((err, req, res, next) => {
	console.log('ERROR CODE: ', err.code);

	if (err.code === '22P02' || err.code === 400) {
		errorHandlers.handleBadRequest(res);
	} else if (err.code === 404) {
		errorHandlers.handleNotFound(res);
	} else {
		errorHandlers.handleUncaughtError(res);
	}
});

app.all('/*', (req, res) => {
	console.log('ERROR CODE: ', 404);
	errorHandlers.handleNotFound(res);
});

module.exports = app;
