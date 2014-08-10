"use strict";

var _ = require('lodash');
var gdLogger = require('../libs/gd_logger.js');

function getHandler() {
	return function(err, req, res, next) {
		if (err) {
			var status = err.status || err.statusCode || err.status_code || 500;
			var message = err.msg || err.message || err.errorMessage || err.error_message || 'Internal server error.';
			err.msg = message;
			
			if (status == 500) {
				message = 'Internal server error.';
			}
			
			res.json(status, {message: message});
			err.req = _.pick(req, ['ip', 'url', 'headers', 'method', 'httpVersion', 'originalUrl', 'query']);
			gdLogger.error(err);
		}
	}
}

module.exports.getHandler = getHandler;