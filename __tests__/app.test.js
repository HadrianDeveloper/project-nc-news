const request = require('supertest');

const db = require('../db/connection.js');
const app = require('../app.js');
const seed  = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const { expect } = require('@jest/globals');


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
    
    test.todo('Respond with 204 code and custom message when table is empty')
});
