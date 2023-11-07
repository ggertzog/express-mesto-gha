const { CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');
const { IncorrectError, NotFoundError } = require('../errors/errors');
const AccessError = require('../errors/AccessError');

module.exports.getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch(err) {
    return next(err);
  }
}

module.exports.createCard = (req, res, next) => {
    const { name, link } = req.body;
    const  owner = req.user._id;
    Card.create({ name, link, owner })
      .then((card) => {
        res.status(ERROR_CODE.CREATED).send(card);
      })
      .catch((err) => {
        if(err instanceof ValidationError) {
          return next(new IncorrectError('Переданы некорректные данные'));
        }
        return next(err);
      });
}

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if(!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    if(card.owner.toString() !== req.user._id.toString()) {
      throw new AccessError('Ошибка прав доступа');
    }
    res.status(ERROR_CODE.OK).send(card);
  } catch(err) {
    if(err instanceof CastError) {
      next(new IncorrectError('Переданы некорректные данные'));
    }
    next(err);
  }
}

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if(!card) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.status(ERROR_CODE.OK).send({card});
    })
    .catch((err) => {
      if(err instanceof CastError) {
        return next(new IncorrectError('Переданы некорректные данные'));
      }
      return next(err);
    });
}

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if(!card) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.status(ERROR_CODE.OK).send({card});
    })
    .catch((err) => {
      if(err instanceof CastError) {
        return next(new IncorrectError('Переданы некорректные данные'));
      }
      return next(err);
    });
}