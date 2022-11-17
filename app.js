const express = require('express');
const app = express()

const { getAllTopics } = require('./controllers/topics-controller.js');
const { getAllArticles, getArticleById, getCommentsForArticle, postComment, patchArticle } = require('./controllers/articles-controller.js');
const { handle404s, handlePSQLerrors, handleCustomErrors } = require('./errors/errors.js');
app.use(express.json());

app.get('/api/topics', getAllTopics);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsForArticle)

app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchArticle)

app.get('*', handle404s)
app.use(handlePSQLerrors)
app.use(handleCustomErrors)

module.exports = app;
