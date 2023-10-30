const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const {ERROR_CODE} = require('../utils/constants')

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(ERROR_CODE.NOT_FOUND).send({
    message: 'Страницы не существует'
  })
})

module.exports = router;