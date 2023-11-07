const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CastError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const {ERROR_CODE} = require('../utils/constants');
const { IncorrectError, NotFoundError, DuplicateEmailError } = require('../errors/errors');

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch(err) {
    return next(err);
  }
}

module.exports.getUserById = async (req, res, next) => {
  await User.findById(req.params.userId ? req.params.userId : req.user._id)
    .orFail(() => next(new NotFoundError('Польователь не найден')))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if(err instanceof CastError) {
        return next(new IncorrectError('Переданы некорректные данные'));
      }

      return next(err)
    });
}

module.exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      }))
      .then((user) => {
        res.status(ERROR_CODE.CREATED).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email
        });
      })
      .catch((err) => {
        if(err.code === 11000) {
          return next(new DuplicateEmailError('Пользователь с таким Email уже существует'));
        };
        if(err instanceof ValidationError) {
          return next(new IncorrectError('Переданы некорректные данные'));
        };
        return next(err)
      })

}

module.exports.updateUser =  (req, res, next) => {
    const userId = req.user._id;
    const { name, about } = req.body;
    User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true,
        runValidators: true,
        upsert: true
      }
    )
      .then((user) => {
        if(!user){
          next(new NotFoundError('Пользователь не найен'));
        }
        res.send({user});
      })
      .catch((err) => {
        if(err instanceof ValidationError) {
          return next(new IncorrectError('Переданы некорректные данные'));
        }
        return next(err);
      });
}

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => {
      if(!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.send({user});
    })
    .catch((err) => {
      if(err instanceof ValidationError) {
        return next(new IncorrectError('Переданы некорректные данные'));
      }
      return next(err);
    });
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-puper-strong-secret', { expiresIn: '7d' });
      res.status(ERROR_CODE.CREATED).send({ token });
    })
    .catch((err) => {
      if(err instanceof ValidationError) {
        return next(new IncorrectError('Переданы некорректные данные'));
      }
      return next(err);
    });
}