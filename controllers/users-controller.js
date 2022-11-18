const {selectAllUsers} = require("../models/users-model.js");
const {} = require("../utils/utils.js")

exports.getAllUsers = (req, res, next) => {
    selectAllUsers()
    .then((usersArray) => {
        res.status(200).send({ allUsers: usersArray })
    })
    .catch(err)
};
