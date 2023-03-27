const models = require('../models/app.models');

const getTopics = async (req, res, next) => {
	try {
		const results = await models.fetchTopics();
		res.status(200).send({ topics: results });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getTopics,
};
