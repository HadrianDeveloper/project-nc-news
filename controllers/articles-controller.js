const { selectAllArticles, selectArticleById, selectCommentsForArticle, insertComment } = require("../models/articles-model.js");
const { checkArticleExists, checkUserExists, checkCommentStructure } = require("../utils/utils.js")

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

exports.postComment = (req, res, next) => {
    const id = req.params.article_id;
    const body = req.body;

    if (!checkCommentStructure(body)) next({ 
        statusCode: 400, msg: 'Bad request! Missing or incorrect key name(s)' 
    });    

    checkUserExists(body.username)
    .then((userExists) => {
        if (!userExists) {
            next({statusCode: 401, msg: 'You need to have an account to post comments' });
        };
        return checkArticleExists(id);
    })
    .then((articleExists) => {
        if (!articleExists) {
            next({ statusCode: 404, msg: 'No article with that ID' });
        };
        return insertComment(id, body);    
    })
    .then(({rows}) => {
        res.status(201).send({postedArticle: rows[0]});
    })
    .catch((err) => {
        next(err);
    })
};



//ORIGINAL PUSHED CODE BEFORE REMOVING PYRAMID OF DOOM!
// exports.postComment = (req, res, next) => {
//     const id = req.params.article_id;
//     const body = req.body;

//     checkUserExists(body.username)
//     .then((userExists) => {
//         if (userExists) {

//             checkArticleExists(id)
//             .then((articleExists) => {
//                 if (articleExists) {

//                     insertComment(id, body)
//                     .then(({rows}) => 
//                         res.status(201).send({postedArticle: rows[0]}))
//                         .catch((err) => next(err))
//                 } else {
//                     return Promise.reject({ statusCode: 404, msg: 'No article with that ID' })
//                 };
//             })
//             .catch((err) => next(err))

//         } else {
//             return Promise.reject({statusCode: 401, msg: 'You need to have an account to post comments' })
//         }
//     })
//     .catch((err) => next(err)
//     )
// };