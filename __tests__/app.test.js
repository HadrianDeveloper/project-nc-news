const request = require('supertest');
const sort = require('jest-sorted')
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
});

describe('/api/articles', () => {
    test('Respond with 200 code and an array of article objects sorted in desc order of created_at date', () => {
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

describe('/api/articles/:article_id/comments', () => {
    test('Respond with 200 code and an array of comments for article sorted in date created order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBe(11);
            body.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String)
                })
            })
            expect(body).toBeSortedBy('created_at', { descending: true});
        });
    });

    test('Respond with 200 code and an empty array if article has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual([]); 
        });
    });

    test('Respond with 404 code and error msg if id valid but does not exist', () => {
        return request(app)
        .get('/api/articles/0/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('No article with that ID');
        });
    });

    test('Respond with 400 code and error msg if bad request', () => {
        return request(app)
        .get('/api/articles/notanid/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request!');
        });
    })
});

describe('POST /api/articles/:article_id/comments', () => {
    test('Respond with 201 and newly created Comment object when user and article exists', () => {
        const input = {
            username: 'rogersop',
            body: 'Lupus non timet canem latrantem! Carpe diem!'
        };
        return request(app)
        .post('/api/articles/2/comments')
        .send(input)
        .expect(201)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                comment_id: expect.any(Number),
                votes: 0,
                created_at: expect.any(String),
                article_id: 2,
                author: 'rogersop',
                body: 'Lupus non timet canem latrantem! Carpe diem!'
            })
        })
    });

    test('Respond with 201 and newly created Comment object when user and article exists, and while ignoring extra properties sent in the post request', () => {
        const input = {
            username: 'rogersop',
            favourite_mammal: 'lynx',
            body: 'Lupus non timet canem latrantem! Carpe diem!'
        };
        return request(app)
        .post('/api/articles/3/comments')
        .send(input)
        .expect(201)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                comment_id: expect.any(Number),
                votes: 0,
                created_at: expect.any(String),
                article_id: 3,
                author: 'rogersop',
                body: 'Lupus non timet canem latrantem! Carpe diem!'
            })
        })
    });

    test('Respond with 401 and error message when trying to post a comment without having an account', () => {
        const input = {
            username: 'pelicanFace',
            body: 'Lupus non timet canem latrantem! Carpe diem!'
        };
        return request(app)
        .post('/api/articles/2/comments')
        .send(input)
        .expect(401)
        .then(({body}) => {
            expect(body.msg).toBe('User not found')
        })
    });

    test('Respond with 404 code and error msg if article id valid but does not exist', () => {
        const input = {
            username: 'rogersop',
            body: 'Lupus non timet canem latrantem! Carpe diem!'
        };
        return request(app)
        .post('/api/articles/2000/comments')
        .send(input)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('No article with that ID')
        })
    });

    test('Respond with 400 code and error msg if bad request', () => {
        const input = {
            username: 'rogersop',
            body: 'Lupus non timet canem latrantem! Carpe diem!'
        };
        return request(app)
        .post('/api/articles/notAnID/comments')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request!')
        })
    });

    test('Respond with 400 code and error msg if POST request has incorrect key', () => {
        const misspeltKeyInput = {
            abusername: 'rogersop',
            body: 'Lupus non timet canem latrantem! Carpe diem!'
        };
        return request(app)
        .post('/api/articles/1/comments')
        .send(misspeltKeyInput)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request! Missing or incorrect properties')
        })
    });

    test('Respond with 400 code and error msg if POST request has missing key', () => {
        const missingKeyInput = { body: 'Lupus non timet canem latrantem! Carpe diem!'};
        return request(app)
        .post('/api/articles/1/comments')
        .send(missingKeyInput)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request! Missing or incorrect properties')
       })
    });

});

describe('PATCH /api/articles/:article_id', () => {
    const voteIncreaser = { inc_votes: 10 };
    const voteDecreaser = { inc_votes: -10 };
    const voteWithBogusProps = { inc_votes: 10, hasPetPelican: true };
    const misspeltVoteIncreaser = { pelicans : 10 }; 

    test('Respond with 200 code and the updated article object - votes are increased', () => {
        return request(app)
        .patch('/api/articles/5')
        .send(voteIncreaser)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: 5,
                title: expect.any(String),
                votes: 10,
                created_at: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
            })
        })
    });

    test('Respond with 200 code and the updated article object - votes are decreased', () => {
        return request(app)
        .patch('/api/articles/5')
        .send(voteDecreaser)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: 5,
                title: expect.any(String),
                votes: -10,
                created_at: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
            })
        })
    });

    test('Respond with 200 code and the updated article object - extra fields ignored', () => {
        return request(app)
        .patch('/api/articles/5')
        .send(voteWithBogusProps)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: 5,
                title: expect.any(String),
                votes: 10,
                created_at: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
            })
        })
    });

    test('Respond with 404 code and custom msg if article ID valid but does not exist', () => {
        return request(app)
        .patch('/api/articles/5000')
        .send(voteIncreaser)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('No article with that ID');
        })
    });

    test('Respond with 400 code and custom msg if article ID is not valid', () => {
        return request(app)
        .patch('/api/articles/notAnId')
        .send(voteIncreaser)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request!');
        })
    }); //HOW IS THIS WORKING?!?!?!?

    test('Respond with 400 code and custom msg if input properties are invalid', () => {
        return request(app)
        .patch('/api/articles/5')
        .send(misspeltVoteIncreaser)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request! Missing or incorrect properties');
        })
    });

    test('Respond with 400 code and custom msg if input properties are missing', () => {
        return request(app)
        .patch('/api/articles/5')
        .send({ clumsy_patch: 'daffodil'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request! Missing or incorrect properties');
        })
    });

    test('Respond with 400 code and custom msg if input value violates field data type', () => {
        return request(app)
        .patch('/api/articles/5')
        .send({ inc_votes: 'five hundred' })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request! Missing or incorrect properties');
        })
    });

});

describe('GET /api/users', () => {
    test('Returns 200 status and array of all users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.allUsers)).toBe(true);
            expect(body.allUsers.length).toBe(4);
            body.allUsers.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            });
        })
    });

})
