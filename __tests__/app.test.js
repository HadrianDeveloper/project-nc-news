const request = require('supertest');
const sort = require('jest-sorted')
const db = require('../db/connection.js');
const app = require('../app.js');
const seed  = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Invalid URL handling', () => {
    test('Respond with 404 code and custom message', () => {
        return request(app)
        .get('/unrealisticURL')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('URL not found')
        })
    })
});

describe('/api/topics', () => {
    test('Respond with 200 code and array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.allTopics)).toBe(true);
            expect(body.allTopics.length).toBe(3);
            body.allTopics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            });
        });
    });
});

describe('/api/articles', () => {
    test.only('Respond with 200 code and an array of article objects sorted in desc order of created_at date', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.allArticles)).toBe(true); 
            expect(body.allArticles.length).toBe(12);
            body.allArticles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                });
            });
            expect(body.allArticles).toBeSortedBy('created_at', { descending: true})
        });
    });
});


describe('/api/articles/:article_id', () => {
    test('Respond with 200 code and an article object', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(Object.keys(body.article[0]).length).toBe(7);
            expect(body.article[0]).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: 1,
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
            });
        });
    });

    test('Respond with 404 code and error msg if id valid but does not yet exist', () => {
        return request(app)
        .get('/api/articles/666')
        .expect(404)
        .then(({body}) => {
              expect(body.msg).toBe('Article not found!')                     
        });
    });

    test('Respond with 400 code and error msg if id invalid', () => {
        return request(app)
        .get('/api/articles/invalidArticleId')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request - invalid input!')
        })
    });
});
