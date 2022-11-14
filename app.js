const express = require('express');
const app = express()

const { getAllTopics } = require('./controllers/topics-controller.js')

app.use(express.json());

app.get('/api/topics', getAllTopics)


app.get('*', (req, res) => {
    res.status(404).send({msg: 'URL not found'})
})

app.use((err, req, res, next) => {
    const { statusCode, msg } = err;
    res.status(statusCode).send({msg})
})

module.exports = app;