const express = require('express');
const app = express()

const { getAllTopics } = require('./controllers/topics-controller.js')

app.use(express.json());

app.get('/api/topics', getAllTopics)





module.exports = app;