const cors = require('cors');
const express = require('express');
const controllers = require('./controllers/app.controllers');
const errorHandlers = require('./error-handlers.js');

const app = express();
app.use(cors());
app.use(express.json());

// ~ Articles
app.get('/api/topics', controllers.getTopics);
app.get('/api/articles', controllers.getArticles);
app.get('/api/articles/:article_id', controllers.getArticleById);
app.get(
	'/api/articles/:article_id/comments',
	controllers.getCommentsByArticleId
);
app.post('/api/articles/:article_id/comments', controllers.postComment);
app.patch('/api/articles/:article_id', controllers.incrementArticleVotes);

// ~ Comments
app.delete('/api/comments/:comment_id', controllers.removeComment);
app.get('/api/comments/:comment_id', controllers.getComment);

// ~ Users
app.get('/api/users', controllers.getUsers);

app.all('/*', errorHandlers.handleWrongPath);

app.use(errorHandlers.handleBadRequest);
app.use(errorHandlers.handleNotFound);
app.use(errorHandlers.handleUncaughtError);

module.exports = app;
