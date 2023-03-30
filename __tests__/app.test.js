const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeEach(() => seed(data));

afterAll(() => db.end());

describe('/api/topics', () => {
	describe('200: GET:', () => {
		it('responds with a 200 status code', () => {
			return request(app).get('/api/topics').expect(200);
		});

		it('responds with an array', () => {
			return request(app)
				.get('/api/topics')
				.expect(200)
				.then(({ body: { topics } }) => {
					expect(topics).toBeInstanceOf(Array);
					expect(topics).toHaveLength(3);
				});
		});

		it('responds with the correct data', () => {
			const testData = [
				{ slug: 'mitch', description: 'The man, the Mitch, the legend' },
				{ slug: 'cats', description: 'Not dogs' },
				{ slug: 'paper', description: 'what books are made of' },
			];

			return request(app)
				.get('/api/topics')
				.expect(200)
				.then(({ body: { topics } }) => {
					expect(topics).toEqual(testData);
				});
		});
	});

	describe('404: GET:', () => {
		it('responds with a 404 status code when given a wrong endpoint', () => {
			return request(app).get('/api/topic').expect(404); // missing an s at the end
		});

		it('responds with a message about the error', () => {
			return request(app)
				.get('/api/topic')
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Resource not found');
				});
		});
	});
});

describe('/api/articles/:article_id', () => {
	describe('200: GET:', () => {
		it('responds with status 200 and a single object with a key of article and with the correct shape', () => {
			return request(app)
				.get('/api/articles/1')
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article).toMatchObject({
						article_id: 1,
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
					});
				});
		});
	});

	describe('201: PATCH: Votes', () => {
		it('should respond with status 201 and an updated votes property, incremented by 1', () => {
			const input = { inc_votes: 1 };

			return request(app)
				.patch('/api/articles/2')
				.send(input)
				.expect(201)
				.then(({ body: { article } }) => {
					expect(article).toMatchObject({
						article_id: 2,
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: 1,
						article_img_url: expect.any(String),
					});
				});
		});

		it('should respond with status 201 and an updated votes property, decremented by 1', () => {
			const input = { inc_votes: -1 };

			return request(app)
				.patch('/api/articles/1')
				.send(input)
				.expect(201)
				.then(({ body: { article } }) => {
					expect(article).toMatchObject({
						article_id: 1,
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: 99,
						article_img_url: expect.any(String),
					});
				});
		});

		it('should respond with status 201 and ignore extra properties', () => {
			const input = { inc_votes: 1, title: 'yahooo', votes: 999999 };

			return request(app)
				.patch('/api/articles/2')
				.send(input)
				.expect(201)
				.then(({ body: { article } }) => {
					expect(article).toMatchObject({
						article_id: 2,
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: 1,
						article_img_url: expect.any(String),
					});
				});
		});
	});

	describe('400: GET:', () => {
		it('responds with a 400 status code when given a value that is not a number', () => {
			return request(app).get('/api/articles/not-a-num').expect(400);
		});

		it('responds with a message about the error', () => {
			return request(app)
				.get('/api/articles/not-a-num')
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
	});

	describe('404: GET:', () => {
		it('responds with a 404 status code when given an id that does not exist', () => {
			return request(app).get('/api/articles/999999').expect(404);
		});

		it('responds with a message about the error', () => {
			return request(app)
				.get('/api/articles/999999')
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Resource not found');
				});
		});
	});

	describe('400: PATCH: Votes', () => {
		it('should respond with status 400 when inc_votes is not present on request body', () => {
			const input = { do_votes: 1 };

			return request(app)
				.patch('/api/articles/2')
				.send(input)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
	});

	describe('404: PATCH: Votes', () => {
		it('should respond with status 404 when article_id does not exist', () => {
			const input = { inc_votes: 1 };

			return request(app)
				.patch('/api/articles/999999')
				.send(input)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Resource not found');
				});
		});
	});
});

describe('/api/articles', () => {
	describe('200: GET:', () => {
		it('responds with status 200 and an array of object with the correct shape', () => {
			const { commentData } = data;

			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toHaveLength(12);
					articles.forEach(article => {
						let commentCount = commentData
							.filter(comment => comment.article_id === article.article_id)
							.length.toString();

						expect(article).toMatchObject({
							article_id: expect.any(Number),
							title: expect.any(String),
							topic: expect.any(String),
							author: expect.any(String),
							body: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							article_img_url: expect.any(String),
							comment_count: commentCount,
						});
					});
					expect(articles).toBeSortedBy('created_at', { descending: true });
				});
		});
	});

	describe('404: GET:', () => {
		it('responds with status 404 and a message about the error', () => {
			return request(app)
				.get('/api/article')
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Resource not found');
				});
		});
	});
});

describe('/api/articles/:article_id/comments', () => {
	describe('200: GET:', () => {
		it('responds with status 200 and an array of comments with the right shape', () => {
			return request(app)
				.get('/api/articles/1/comments')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).toHaveLength(11);
					comments.forEach(comment => {
						expect(comment).toMatchObject({
							comment_id: expect.any(Number),
							body: expect.any(String),
							article_id: 1,
							author: expect.any(String),
							votes: expect.any(Number),
							created_at: expect.any(String),
						});
					});
					expect(comments).toBeSortedBy('created_at', { descending: true });
				});
		});

		it('responds with status 200 and an empty array when there is no comments', () => {
			return request(app)
				.get('/api/articles/2/comments')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).toEqual([]);
				});
		});
	});

	describe('201: POST:', () => {
		it('responds with a status of 201 and an object with the posted comment with a key of comment', () => {
			const comment = { username: 'butter_bridge', body: 'i am so hungry' };

			return request(app)
				.post('/api/articles/6/comments')
				.send(comment)
				.expect(201)
				.then(({ body: { comment } }) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						body: 'i am so hungry',
						article_id: 6,
						author: 'butter_bridge',
						votes: 0,
						created_at: expect.any(String),
					});
				});
		});

		it('responds with a status of 201 and ignores any additional properties on the request body', () => {
			const comment = {
				username: 'butter_bridge',
				body: 'i am so hungry',
				votes: 99999,
				something: 'else to ignore',
			};

			return request(app)
				.post('/api/articles/6/comments')
				.send(comment)
				.expect(201)
				.then(({ body: { comment } }) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						body: 'i am so hungry',
						article_id: 6,
						author: 'butter_bridge',
						votes: 0,
						created_at: expect.any(String),
					});
				});
		});
	});

	describe('404: GET:', () => {
		it('responds with status 404 when given an article_id that does not exist yet', () => {
			return request(app)
				.get('/api/articles/99999/comments')
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Resource not found');
				});
		});
	});

	describe('400: GET:', () => {
		it('responds with status 400 when given an article_id that can not exist', () => {
			return request(app)
				.get('/api/articles/someid/comments')
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
	});

	describe('404: POST:', () => {
		it('responds with status 404 when given an article_id that does not exist yet', () => {
			const comment = { username: 'butter_bridge', body: 'i am so hungry' };

			return request(app)
				.post('/api/articles/99999/comments')
				.send(comment)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Resource not found');
				});
		});

		it('responds with status 404 when the username given is not one in the database', () => {
			const comment = { username: 'billy', body: 'i am so hungry' };

			return request(app)
				.post('/api/articles/6/comments')
				.send(comment)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Resource not found');
				});
		});
	});

	describe('400: POST:', () => {
		it('responds with status 400 when given an article_id that can not exist', () => {
			const comment = { username: 'butter_bridge', body: 'i am so hungry' };

			return request(app)
				.post('/api/articles/someid/comments')
				.send(comment)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});

		it('responds with status 400 when the request body is missing a username or a body', () => {
			const comment1 = { username: 'butter_bridge' };
			const comment2 = { body: 'i am so hungry' };

			return Promise.all([
				request(app)
					.post('/api/articles/6/comments')
					.send(comment1)
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					}),
				request(app)
					.post('/api/articles/6/comments')
					.send(comment2)
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					}),
			]);
		});
	});
});

describe('/api/comments/:comment_id', () => {
	describe('204: DELETE:', () => {
		it('responds with status 204 and a message', () => {
			return request(app).delete('/api/comments/1').expect(204);
		});
	});

	describe('404: DELETE:', () => {
		it('responds with status 404 when the comment id does not exist', () => {
			return request(app)
				.delete('/api/comments/99999')
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Resource not found');
				});
		});
	});

	describe('400: DELETE:', () => {
		it('responds with status 400 when given a non int value', () => {
			return request(app)
				.delete('/api/comments/not-a-num')
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
	});
});