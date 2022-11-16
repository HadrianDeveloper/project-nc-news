const { selectAllArticles, selectArticleById, selectCommentsForArticle } = require("../models/articles-model.js");
const { checkArticleExists } = require("../utils/utils.js")

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

exports.getCommentsForArticle = (req, res, next) => {
    const id = req.params.article_id

    checkArticleExists(id)
    .then((exists) => {
        if (exists) {
            selectCommentsForArticle(id)
            .then((results) => res.status(200).send(results))
            .catch((err) => next(err))
        } else {
            return Promise.reject({statusCode: 404, msg: 'No article with that ID' })
        }
    })
    .catch((err) => {
        next(err)
    })
};