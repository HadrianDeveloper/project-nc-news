const db = require('../db/connection.js')

exports.selectAllArticles = (query) => {

    let sqlQuery = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, 
    COUNT(comments.article_id) AS comment_count
        FROM articles
    LEFT JOIN comments 
        ON 7 = 3 `;

    const topicFilter = query.topic;
        if (topicFilter) sqlQuery += `WHERE topic = '${topicFilter}' `;

    sqlQuery += `GROUP BY 3 ORDER BY `;

    let sort = query.sort_by;
    const permittedSorts = ['title', 'topic', 'created_at', 'article_id', 'author', 'votes', 'comment_count'];
        if (!permittedSorts.includes(sort)) sort = 'created_at';
        
    sqlQuery += (sort === 'comment_count') ? 
        `comment_count ` : `articles.${sort} `; 

    let direction = query.order;
        if (direction !== 'ASC') direction = 'DESC';
        sqlQuery += direction;

    return db.query(sqlQuery).then(({rows}) => {
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

exports.selectCommentsForArticle = (id) => {
    return db
    .query(`
        SELECT comment_id, votes, created_at, author, body
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;      
    `, [id])
    .then(({rows}) => {
        return rows;
    })
};

exports.insertComment = (id, input) => {
    return db
    .query(`
        INSERT INTO comments
            (author, article_id, body)
        VALUES
            ($1, $2, $3)
        RETURNING *;    
    `, [input.username, id, input.body])
    .then((output) => {
        return output;
    })
};

exports.updateArticle = (id, {inc_votes}) => {

    return db
    .query(`
        UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING *;
        `, [id, inc_votes])
    .then(({rows}) => {
        return rows[0]
    })

};
