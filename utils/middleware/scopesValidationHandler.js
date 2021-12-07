const boom = require('@hapi/boom');

function scopesValidationHandler({ isAdmin }) {
  return function (req, res, next) {
    if (isAdmin === 'true') {
      next();
    } else {
      next(boom.unauthorized('Insufficient Scoopes'));
    }
  };
}

module.exports = scopesValidationHandler;
