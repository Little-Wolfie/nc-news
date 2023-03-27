const models = require('../models/app.models');

const getTopics = async (req, res, next) => {
	try {
		const results = await models.fetchTopics();

		if (results.rowCount === 0) {
			next({ code: 404 });
		} else {
			res.status(200).send({ topics: results.rows });
		}
	} catch (err) {
		next(err);
	}
};

const getArticleById = async (req, res, next) => {
	const { article_id } = req.params;

	try {
		const results = await models.fetchArticleById(article_id);

		if (results.rowCount === 0) {
			next({ code: 404 });
		} else {
			res.status(200).send({ article: results.rows[0] });
		}
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getTopics,
	getArticleById,
};
