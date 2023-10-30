const User = require('../models/user');
const {ERROR_CODE} = require('../utils/constants');

module.exports.getAllUsers = async (req, res) => {
  await User.find({})
  .then((users) => res.status(ERROR_CODE.OK).send(users))
  .catch(() => {
    res.status(ERROR_CODE.SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера'
    });
  });
}

module.exports.getUserById = async (req, res) => {
  await User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(ERROR_CODE.OK).send(user);
    })
    .catch((err) => {
      if(err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные'
        })
      } else if (err.message === 'NotFound') {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Ошибка на стороне сервера'
        });
      }
    });
}

module.exports.createUser = (req, res) => {
    const { name, about, avatar} = (req.body);
    User.create({ name, about, avatar })
      .then((user) => {
        res.status(ERROR_CODE.CREATED).send(user);
      })
      .catch((err) => {
        if(err.name === 'ValidationError') {
          res.status(ERROR_CODE.BAD_REQUEST).send({
            message: 'Переданы некорректные данные'
          });
        } else {
          res.status(ERROR_CODE.SERVER_ERROR).send({
            message: 'Ошибка на стороне сервера'
          });
        }
      })

}

module.exports.updateUser =  (req, res) => {
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
          res.status(ERROR_CODE.NOT_FOUND).send({
            message: 'Пользователь не найден'
          });
        }
        res.status(200).send({user});
      })
      .catch((err) => {
        if(err.name === 'ValidationError') {
          res.status(ERROR_CODE.BAD_REQUEST).send({
            message: 'Переданы некорректные данные'
          });
        } else {
          res.status(ERROR_CODE.SERVER_ERROR).send({
            message: 'Ошибка на стороне сервера'});
      }
      });
}

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => {
      if(!user) {
        res.status(ERROR_CODE.NOT_FOUND).send({
          message: 'Пользователь не найден'
        })
      }
      res.status(200).send({user});
    })
    .catch((err) => {
      if(err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные'
        })
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Ошибка на стороне сервера'});
    }
    })
}