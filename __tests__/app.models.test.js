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
					expect(topics.rows).toBeInstanceOf(Array);
					expect(topics.rows).toHaveLength(3);
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
					expect(topics.rows).toEqual(testData);
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
