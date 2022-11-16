const db = require('../db/connection.js');

exports.checkArticleExists = (id) => {
    return db
    .query('SELECT title FROM articles WHERE article_id = $1', [id])
    .then(({rows}) => {
        return (rows.length) ? true : false;
    })
}


