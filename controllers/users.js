const User = require('../models/user');

function readAllUsers(req, res) {
  return User.find()
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
}

function createUser(req, res) {
  const userData = req.body;
  console.log(userData);

  return User.create(userData)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'User not created' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
}

function readUser(req, res) {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
}

function updateUser(req, res) {
  const userData = req.body;
  const userId = req.user._id;
  if (userId) {
    return User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true,
    })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send({ message: err.message });
        }
        return res.status(500).send({ message: 'Server Error' });
      });
  }
  return res.status(400).send({ message: 'User ID not provided' });
}

function updateUserAvatar(req, res) {
  const userData = req.body;
  const userId = req.user._id;
  const avatarData = userData.avatar;
  if (userId) {
    return User.findByIdAndUpdate(userId, { avatar: avatarData }, {
      new: true,
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true,
    })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send({ message: err.message });
        }
        return res.status(500).send({ message: 'Server Error' });
      });
  }
  return res.status(404).send({ message: 'User ID not provided' });
}

module.exports = {
  readAllUsers,
  createUser,
  readUser,
  updateUser,
  updateUserAvatar,
};
