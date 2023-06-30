const { getUsers, getUsername } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  getUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  getUsername(username)
    .then((user) => {
      if (typeof user.username !== "string") {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }

      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  getUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
