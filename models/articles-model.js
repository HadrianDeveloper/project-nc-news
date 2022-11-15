const db = require('../db/connection.js')

exports.selectAllArticles = () => {
    return db
    .query(`
            SELECT * FROM articles
            ORDER BY created_at DESC;
        `)
    .then(({rows}) => {
        return rows;
    })
};