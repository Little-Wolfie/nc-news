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
});

describe('/api/articles', () => {
	describe('200: GET:', () => {
		it('responds with status 200 and an array of object with the correct shape', () => {
			const { commentData } = data;

			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toBeInstanceOf(Array);
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