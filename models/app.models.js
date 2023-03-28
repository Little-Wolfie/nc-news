const db = require('../db/connection');

exports.fetchTopics = async () => {
	const results = await db.query('SELECT * FROM topics');

	if (results.rowCount === 0) {
		return Promise.reject({ code: 404 });
	} else {
		return results.rows;
	}
};

exports.fetchArticleById = async id => {
	const results = await db.query(
		'SELECT * FROM articles WHERE article_id = $1',
		[id]
	);

	if (results.rowCount === 0) {
		return Promise.reject({ code: 404 });
	} else {
		return results.rows[0];
	}
};

exports.fetchArticles = async () => {
	const results = await db.query('SELECT * FROM articles');

	if (results.rowCount === 0) {
		return Promise.reject({ code: 404 });
	} else {
		return results.rows;
	}
};
