const { selectAllArticles, selectArticleById } = require("../models/articles-model.js");

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((allArticles) => {
        res.status(200).send({allArticles: allArticles})
    })
    .catch(next)
};

exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id; 
    const isValidInput = (/^\d*$/);

    if (!isValidInput.test(id)) {
        next({ statusCode: 400, msg: 'Bad request - invalid input!'})
    };
    
    selectArticleById(id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
};