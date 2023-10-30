const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');

module.exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(ERROR_CODE.OK).send(cards);
  } catch(err) {
    return res.status(ERROR_CODE.SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера'
    });
  }
}

module.exports.createCard = (req, res) => {
    const { name, link } = req.body;
    const  owner = req.user._id;
    Card.create({ name, link, owner })
      .then((card) => {
        return res.status(ERROR_CODE.CREATED).send(card);
      })
      .catch((err) => {
        if(err.name === 'ValidationError') {
          res.status(ERROR_CODE.BAD_REQUEST).send({
            message: 'Переданы некорректные данные'
          });
          return;
        } else {
          res.status(ERROR_CODE.SERVER_ERROR).send({
            message: 'Ошибка на стороне сервера'
          });
          return;
        }
      });
}

module.exports.deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndRemove(req.params.cardId);
    if(!deletedCard) {
      res.status(ERROR_CODE.NOT_FOUND).send({
        message: 'Карточка не найдена'
      });
      return;
    }
    res.status(ERROR_CODE.OK).send(deletedCard);
  } catch(err) {
      if(err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные'
        });
        return;
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Ошибка на стороне сервера'
        });
        return;
      }
  }
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if(!card) {
        res.status(ERROR_CODE.NOT_FOUND).send({
          message: 'Карточка не найдена'
        });
        return;
      }
      res.status(ERROR_CODE.OK).send({card});
    })
    .catch((err) => {
      if(err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные'
        });
        return;
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: "Ошибка на стороне сервера"
        });
        return;
      }
    });
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if(!card) {
        res.status(ERROR_CODE.NOT_FOUND).send({
          message: 'Карточка не найдена'
        });
        return;
      }
      res.status(ERROR_CODE.OK).send({card});
    })
    .catch((err) => {
      if(err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные'
        });
        return;
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: "Ошибка на стороне сервера"
        });
        return;
      }
    });
}