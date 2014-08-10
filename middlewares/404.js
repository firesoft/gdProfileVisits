"use strict";

var gdLogger = require('../libs/gd_logger.js');

function getHandler() {
	return function(req, res) {
		res.json(404, {message: 'four - oh - four'});
		gdLogger.warn('four - oh - four @ url: ' + req.url);
	}
}


module.exports.getHandler = getHandler;