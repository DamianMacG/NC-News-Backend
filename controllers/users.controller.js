const { getUsers } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  getUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};