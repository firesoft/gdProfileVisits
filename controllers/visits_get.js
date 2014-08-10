"use strict";

var gdValidationHelper = require('../libs/gd_validation_helper.js');
var visitsModel = require('../models/visits.js');

function get(req, res, next) {
	visitsModel.get(req.parsedData, function(err, data) {
		if (err) return next(err);
		res.json(data);
	});
}

function validate(req, res, next) {
	req.checkParams('playerId', 'Invalid playerId param.').notEmpty().isInt();
	if (!req.query.limit) {
		req.query.limit = 10;
	}
	req.checkQuery('limit', 'Invalid limit param.').isInt(); 
	
	var err = gdValidationHelper.checkValidationErrors(req);
	if (err) return next(err); 
	
	req.sanitize('playerId').toInt();
	req.sanitize('limit').toInt();
	initParsedData(req);
	
	next();
}

function initParsedData(req) {
	req.parsedData = {};
	req.parsedData.playerId = req.params.playerId;
	req.parsedData.limit = req.query.limit;
}

module.exports.get = get;
module.exports.validate = validate;