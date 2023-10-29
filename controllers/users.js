const User = require('../models/user');
const {ERROR_CODE} = require('../utils/constants');

module.exports.getAllUsers = async (req, res) => {
  await User.find({})
  .then((users) => res.status(ERROR_CODE.OK).send(users))
  .catch(() => {
    return res.status(ERROR_CODE.SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера'
    });
  });
}

module.exports.getUserById = async (req, res) => {
  await User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден' });
      };
      res.status(ERROR_CODE.OK).send(user);
    })
    .catch(() => {
      return res.status(ERROR_CODE.SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера'
      });
    });
}

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    return res.status(ERROR_CODE.CREATED).send(newUser.save());
} catch(err) {
    if(err.name === 'ValidationError') {
      return res.status(ERROR_CODE.BAD_REQUEST).send({
        message: 'Переданы некорректные данные'
      });
    } else {
      return res.status(ERROR_CODE.SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера'
      })
    }
  }
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
          return res.status(ERROR_CODE.NOT_FOUND).send({
            message: 'Пользователь не найден'
          });
        }
        res.status(200).send({user});
      })
      .catch((err) => {
        if(err.name === 'ValidationError') {
          return res.status(ERROR_CODE.BAD_REQUEST).send({
            message: 'Переданы некорректные данные'
          });
        } else {
          return res.status(ERROR_CODE.SERVER_ERROR).send({
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
    .then((avatar) => {
      if(!avatar) {
        return res.status(ERROR_CODE.NOT_FOUND).send({
          message: 'Пользователь не найден'
        })
      }
      res.status(200).send({avatar});
    })
    .catch((err) => {
      if(err.name === 'ValidationError') {
        return res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные'
        })
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Ошибка на стороне сервера'});
    }
    })
}