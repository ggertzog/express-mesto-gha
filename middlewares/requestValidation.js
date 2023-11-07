const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const isURL = (value, helpers) =>
  validator.isURL(value) ? value : helpers.message('Некорректная ссылка');

const signinValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
})

const signupValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(isURL),
  })
})

const userIdValidate = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required()
  })
})

const userInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30)
  })
})

const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isURL)
  })
})

const cardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(isURL),
  })
})

const cardIdValidate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required()
  })
})

module.exports = {
  signinValidate,
  signupValidate,
  userIdValidate,
  userInfoValidation,
  avatarValidation,
  cardValidate,
  cardIdValidate
}