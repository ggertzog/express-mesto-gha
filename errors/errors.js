const UnauthorizedError = require('./UnauthorizedError');
const IncorrectError = require('./IncorrectError');
const NotFoundError = require('./NotFoundError');
const DuplicateEmailError = require('./DuplicateEmailError');
const AccessError = require('./AccessError');

module.exports = {
  UnauthorizedError,
  IncorrectError,
  NotFoundError,
  DuplicateEmailError,
  AccessError
}