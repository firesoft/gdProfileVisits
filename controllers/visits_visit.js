"use strict";

var gdValidationHelper = require('../libs/gd_validation_helper.js');
var visitsModel = require('../models/visits.js');

function visit(req, res, next) {
	visitsModel.visit(req.parsedData, function(err, data) {
		if (err) return next(err);
		res.json(data);
	});
}

function validate(req, res, next) {
	req.checkParams('playerId', 'Invalid playerId param.').notEmpty().isInt();
	req.checkBody('visitorId', 'Invalid visitorId param.').notEmpty().isInt();
	if (!req.query.limit) {
		req.query.limit = 10;
	}
	req.checkQuery('limit', 'Invalid limit param.').isInt(); 
	
	var err = gdValidationHelper.checkValidationErrors(req);
	if (err) return next(err); 
	
	req.sanitize('playerId').toInt();
	req.sanitize('visitorId').toInt();
	req.sanitize('limit').toInt();
	initParsedData(req);
	
	next();
}

function initParsedData(req) {
	req.parsedData = {};
	req.parsedData.playerId = req.params.playerId;
	req.parsedData.visitorId = req.body.visitorId;
	req.parsedData.limit = req.query.limit;
}

module.exports.visit = visit;
module.exports.validate = validate;