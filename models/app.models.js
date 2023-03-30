const db = require('../db/connection');

exports.fetchUser = async username => {
	const userQuery = db.query(
		`
    SELECT * FROM users WHERE username = $1;
  `,
		[username]
	);
	return userQuery;
};

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
	const articleQuery = await this.fetchArticleById(id);

	const commentsQuery = await db.query(
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

exports.createNewComment = async (id, username, body) => {
	const articleQuery = await this.fetchArticleById(id);

	const insertQuery = await db.query(
		`
	  INSERT INTO comments (votes, created_at, author, body, article_id)
	  VALUES
    ($1, $2, $3, $4, $5)
	  RETURNING *
	`,
		[0, new Date(), username, body, id]
	);

	const results = await Promise.all([articleQuery, insertQuery]);

	if (results[0].rowCount === 0) {
		return Promise.reject({ code: 404 });
	} else {
		return results[1].rows[0];
	}
};

exports.updateArticleVotes = async (id, amt) => {
	const articleQuery = await this.fetchArticleById(id);

	const updateQuery = await db.query(
		`
    UPDATE articles
    SET votes = articles.votes + $1
    WHERE article_id = $2
    RETURNING *;
  `,
		[amt, id]
	);

	const results = await Promise.all([articleQuery, updateQuery]);

	if (results[0].rowCount === 0) {
		return Promise.reject({ code: 404 });
	} else {
		return results[1].rows[0];
	}
};

exports.fetchComment = async id => {
	const results = await db.query(
		`
    SELECT * FROM comments
    WHERE comment_id = $1;
  `,
		[id]
	);

	if (results.rowCount === 0) {
		return Promise.reject({ code: 404 });
	} else {
		return results;
	}
};

exports.deleteComment = async id => {
	const comment = await this.fetchComment(id);

	const deleteQuery = await db.query(
		`
    DELETE FROM comments
    WHERE comment_id = $1;
  `,
		[id]
	);

	const results = Promise.all([comment, deleteQuery]);

	if (results.rowCount === 0) {
		return Promise.reject({ code: 404 });
	}
};