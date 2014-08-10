"use strict";

var _ = require('lodash');

function sanitizeToInt(req, params) {
	params.forEach(function(param) {
		req.sanitize(param).toInt();
	});
}

function checkValidationErrors(req) {
	var errors = req.validationErrors();
	if (errors) {
		var err = new Error( _.uniq(_.pluck(errors, 'msg')).join(' '));
		err.status = 400;
		return err;
	}
	return null;
}

module.exports.checkValidationErrors = checkValidationErrors;
module.exports.sanitizeToInt = sanitizeToInt;