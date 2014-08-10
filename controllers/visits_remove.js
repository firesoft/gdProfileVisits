"use strict";

var gdValidationHelper = require('../libs/gd_validation_helper.js');
var visitsModel = require('../models/visits.js');

function remove(req, res, next) {
	visitsModel.remove(req.parsedData.playerId, req.parsedData.visitorId, function(err, count) {
		if (err) return next(err);
		res.json({removed: count});
	});
}


function validate(req, res, next) {
	req.checkParams('playerId', 'Invalid playerId param.').notEmpty().isInt();
	req.checkBody('visitorId', 'Invalid visitorId param.').notEmpty().isInt();
	
	var err = gdValidationHelper.checkValidationErrors(req);
	if (err) return next(err); 
	
	req.sanitize('playerId').toInt();
	req.sanitize('visitorId').toInt();
	initParsedData(req);
	
	next();
}

function initParsedData(req) {
	req.parsedData = {};
	req.parsedData.playerId = req.params.playerId;
	req.parsedData.visitorId = req.body.visitorId;
}

module.exports.remove = remove;
module.exports.validate = validate;