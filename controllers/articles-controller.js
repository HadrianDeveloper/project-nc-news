const { selectAllArticles } = require("../models/articles-model.js");

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((allArticles) => {
        res.status(200).send({allArticles: allArticles})
    })
    .catch(next)
};