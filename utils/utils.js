const db = require('../db/connection.js');

exports.checkArticleExists = (id) => {
    return db
    .query('SELECT title FROM articles WHERE article_id = $1', [id])
    .then(({rowCount}) => {
        return rowCount ? true : false;
    })
};

exports.checkUserExists = (username) => {
    return db
    .query('SELECT * FROM users WHERE username = $1', [username])
    .then(({rowCount}) => {
        return rowCount ? true : false;
    })
};

exports.checkCommentStructure = (newComment) => {
    const requiredKeys = ['body', 'username'];
    return requiredKeys.every((key) => key in newComment)
};