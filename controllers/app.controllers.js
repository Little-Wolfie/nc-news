const models = require('../models/app.models');

exports.getTopics = async (req, res, next) => {
	try {
		const topics = await models.fetchTopics();
		res.status(200).send({ topics });
	} catch (err) {
		next(err);
	}
};

exports.getArticleById = async (req, res, next) => {
	const { article_id } = req.params;

	try {
		const article = await models.fetchArticleById(article_id);
		res.status(200).send({ article });
	} catch (err) {
		next(err);
	}
};

exports.getArticles = async (req, res, next) => {
	try {
		const articles = await models.fetchArticles();
		res.status(200).send({ articles });
	} catch (err) {
		next(err);
	}
};

exports.getCommentsByArticleId = async (req, res, next) => {
	const { article_id } = req.params;

	try {
		const comments = await models.fetchCommentsByArticleId(article_id);
		res.status(200).send({ comments });
	} catch (err) {
		next(err);
	}
};

exports.postComment = async (req, res, next) => {
	const { article_id } = req.params;
	const { username, body } = req.body;

	try {
		const comment = await models.createNewComment(article_id, username, body);
		res.status(201).send({ comment });
	} catch (err) {
		next(err);
	}
};
