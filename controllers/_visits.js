var visitsModel = require('../models/visits');
var gdError = require('../libraries/gd_error');

function get(req, res, next) {
	var owner = getOwner(req);
	if (!owner) return next(gdError(400, 'no playerId param!'));
	
	visitsModel.get(owner, function(err, data) {
		if (err) return	next(err);
		res.json(data);
	});
}

function visit(req, res, next) {
	var owner = getOwner(req);
	if (!owner) return next(gdError(400, 'no playerId param!'));
	
	var visitor = getVisitor(req);
	if (!visitor) return next(gdError(400, 'no visitor param!'));
	
	visitsModel.visit(owner, visitor, function (err, visitsObj) {
		if (err) return	next(err);
		res.json(visitsObj);
	});
}

function remove(req, res, next) {
	var owner = getOwner(req);
	if (!owner) return next(gdError(400, 'no playerId param!'));
	
	var visitor = getVisitor(req);
	if (!visitor) return next(gdError(400, 'no visitor param!'));
	
	visitsModel.remove(owner, visitor, function(err, removedVisitors) {
		if (err) return next(err);
		res.json({removed:removedVisitors});
	});
}

function getOwner(req) {
	var owner = parseInt(req.params.playerId);
	return owner;
}

function getVisitor(req) {
	var visitor = parseInt(req.body.visitor);
	return visitor;
}
module.exports.get = get;
module.exports.visit = visit;
module.exports.remove = remove;