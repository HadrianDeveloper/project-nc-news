const db = require('../db/connection.js')

exports.selectAllTopics = () => {
    return db
    .query('SELECT * FROM topics')
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ statusCode: 204, msg: 'Topics has not data'})
        }
        return rows;
    })
}