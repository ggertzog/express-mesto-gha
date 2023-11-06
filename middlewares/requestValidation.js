const { Joi, celebrate } = require('celebrate');

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
    avatar: Joi.string()
  })
})
// не забыть добавить валидацию на юрл
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
    avatar: Joi.string().required()
  })
})
// не забыть провалидировать юрл
const cardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
  })
})
// не забывать провалидировать
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