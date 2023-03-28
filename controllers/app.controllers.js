const models = require('../models/app.models');

const getTopics = async (req, res, next) => {
	try {
		const topics = await models.fetchTopics();
		res.status(200).send({ topics: topics });
	} catch (err) {
		next(err);
	}
};

const getArticleById = async (req, res, next) => {
	const { article_id } = req.params;

	try {
		const article = await models.fetchArticleById(article_id);
		res.status(200).send({ article: article });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getTopics,
	getArticleById,
};
