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

exports.checkObjectStructure = (method, obj) => {
    if (method === 'POST') {
        return ['body', 'username'].every((key) => key in obj)
    };

    if (method === 'PATCH') {
        return ('inc_votes' in obj && typeof obj.inc_votes === 'number');
    };
};