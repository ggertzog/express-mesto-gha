const router = require('express').Router();
const { getAllCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
const { cardValidate, cardIdValidate } = require('../middlewares/requestValidation');

router.get('/', getAllCards);
router.post('/', cardValidate, createCard);
router.delete('/:cardId', cardIdValidate, deleteCard);
router.put('/:cardId/likes', cardIdValidate, likeCard);
router.delete('/:cardId/likes', cardIdValidate, dislikeCard);

module.exports = router;