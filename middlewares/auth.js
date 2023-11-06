const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if(!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-puper-strong-secret');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
}