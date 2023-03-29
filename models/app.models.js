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
		`SELECT articles.*, COALESCE(comments.comment_count, 0) AS comment_count
    FROM articles
    LEFT JOIN (
    SELECT article_id, COUNT(article_id) AS comment_count
    FROM comments
    GROUP BY article_id
    ) comments
    ON articles.article_id = comments.article_id
    ORDER BY articles.created_at DESC;`
	);

	if (articleQuery.rowCount === 0) {
		return Promise.reject({ code: 404 });
	} else {
		return articleQuery.rows;
	}
};

exports.fetchCommentsByArticleId = async id => {
	const articleQuery = db.query(
		`
    SELECT * FROM articles
    WHERE article_id = $1
    `,
		[id]
	);

	const commentsQuery = db.query(
		`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
  `,
		[id]
	);

	const results = await Promise.all([articleQuery, commentsQuery]);

	if (results[0].rowCount === 0) {
		return Promise.reject({ code: 404 });
	} else {
		return results[1].rows;
	}
};