const express = require('express');
const app = express()

const { getAllTopics } = require('./controllers/topics-controller.js');
const { getAllArticles, getArticleById } = require('./controllers/articles-controller.js');
app.use(express.json());

app.get('/api/topics', getAllTopics);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticleById);

app.get('*', (req, res) => {
    res.status(404).send({msg: 'URL not found'})
})

app.use((err, req, res, next) => {
    const { statusCode, msg } = err;
    res.status(statusCode).send({msg})
})

module.exports = app;
