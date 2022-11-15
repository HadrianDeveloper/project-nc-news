const db = require('../db/connection.js')

exports.selectAllArticles = () => {
    return db
    .query(`
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count
            FROM articles
        LEFT JOIN comments 
            ON 7 = 3
        GROUP BY 3
        ORDER BY 5 DESC;
        `)
    .then(({rows}) => {
        return rows;
    })
};

exports.selectArticleById = (id) => {
    return db
    .query(`
        SELECT * FROM articles
        WHERE article_id = $1;
    `, [id])
    .then(({rows}) => {
        return (!rows.length)
            ? Promise.reject({ statusCode: 404, msg: 'Article not found!' })
            : rows;
    })
};

