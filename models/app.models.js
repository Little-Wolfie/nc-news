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
	const articleQuery = await db.query(
		'SELECT * FROM articles ORDER BY created_at DESC'
	);
	const commentQuery = await db.query('SELECT * FROM comments');

	if (articleQuery.rowCount === 0) {
		return Promise.reject({ code: 404 });
	} else {
		const { rows: articles } = articleQuery;
		const { rows: comments } = commentQuery;

		articles.map(article => {
			article['comment_count'] = comments.filter(
				comment => comment.article_id === article.article_id
			).length;
		});

		return articleQuery.rows;
	}
};
