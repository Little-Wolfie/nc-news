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
	const { topic, sort_by, order_by } = req.query;

	try {
		const articles = await models.fetchArticles(topic, sort_by, order_by);
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
	const {
		body: { username, body },
	} = req;

	try {
		if (!username || !body) {
			next({ code: 400 });
		} else {
			const user = await models.fetchUser(username);
			if (user.rowCount === 0) {
				next({ code: 404 });
			} else {
				const comment = await models.createNewComment(
					article_id,
					username,
					body
				);
				res.status(201).send({ comment });
			}
		}
	} catch (err) {
		next(err);
	}
};

exports.incrementArticleVotes = async (req, res, next) => {
	const { article_id } = req.params;
	const {
		body: { inc_votes },
	} = req;

	try {
		if (!inc_votes) {
			next({ code: 400 });
		} else {
			const article = await models.updateArticleVotes(article_id, inc_votes);
			res.status(201).send({ article });
		}
	} catch (err) {
		next(err);
	}
};

exports.getComment = async (req, res, next) => {
	const { comment_id } = req.params;

	try {
		const comment = await models.fetchComment(comment_id);
		res.status(200).send({ comment });
	} catch (err) {
		next(err);
	}
};

exports.removeComment = async (req, res, next) => {
	const { comment_id } = req.params;

	try {
		await models.deleteComment(comment_id);
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};

exports.getUsers = async (req, res, next) => {
	try {
		const users = await models.fetchUsers();
		res.status(200).send({ users });
	} catch (err) {
		next(err);
	}
};