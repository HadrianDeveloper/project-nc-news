const express = require('express');
const app = express();
app.use(express.json());

const { getAllTopics } = require('./controllers/topics-controller.js');
const { getAllArticles, getArticleById, getCommentsForArticle, postComment, patchArticle } = require('./controllers/articles-controller.js');
const { getAllUsers } = require('./controllers/users-controller.js');
const { handle404s, handlePSQLerrors, handleCustomErrors } = require('./errors/errors.js');

app.get('/api/topics', getAllTopics);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsForArticle)
app.get('/api/users', getAllUsers)

app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchArticle)

app.get('*', handle404s)
app.use(handlePSQLerrors)
app.use(handleCustomErrors)

module.exports = app;
