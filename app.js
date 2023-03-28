const express = require('express');
const controllers = require('./controllers/app.controllers');
const errorHandlers = require('./error-handlers.js');

const app = express();

app.get('/api/topics', controllers.getTopics);
app.get('/api/articles', controllers.getArticles);
app.get('/api/articles/:article_id', controllers.getArticleById);

app.all('/*', errorHandlers.handleWrongPath);

app.use(errorHandlers.handleBadRequest);
app.use(errorHandlers.handleNotFound);
app.use(errorHandlers.handleUncaughtError);

module.exports = app;
