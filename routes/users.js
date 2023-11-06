const router = require('express').Router();
const { getAllUsers, getUserById, updateUser, updateAvatar } = require('../controllers/users');
const { userIdValidate, userInfoValidation, avatarValidation } = require('../middlewares/requestValidation');

router.get('/', getAllUsers);
router.get('/me', getUserById);
router.get('/:userId', userIdValidate, getUserById);
// router.post('/', createUser);
router.patch('/me', userInfoValidation, updateUser);
router.patch('/me/avatar', avatarValidation, updateAvatar);

module.exports = router;