
/**
 * Reference: https://gist.github.com/justmoon/15511f92e5216fa2624b
 */
'use strict';

var _ = require('lodash');

module.exports = function HttpError (statusCode, type, message, extra) {
  if (typeof(Error.captureStackTrace) === 'function') {
    Error.captureStackTrace(this, this.constructor)
  }
  if (_.isNumber(statusCode)) {
    this.statusCode = statusCode
  }
  this.type = type
  this.message = message
  _.extend(this, extra)
};

require('util').inherits(module.exports, Error);