var redis = require('../libs/gd_redis.js');
var functions = require('../libs/functions.js');
var keyPrefix = 'pv_';


function get(getData, callback) {
	getFromRedis(getData, callback);
}

function visit(visitData, callback) {
	var playerId = visitData.playerId;
	var visitorId = visitData.visitorId;
	if (playerId == visitorId) {
		return get(visitData, callback);
	}
	updateRedis(playerId, visitorId, function(err) {
		if (err) return callback(err, null);
		return get(visitData, callback);
	});
}

function getVisitorsKey(playerId) {
	return keyPrefix + playerId;
}

function getCountKey(playerId) {
	return keyPrefix + 'c_' + playerId;
}

function getEmptyObject(playerId) {
	return {playerId: playerId, count:0, visitors: []};
}

function parseCountReply(reply) {
	if (!reply) {
		return 0;
	}
	return parseInt(reply);
}

function parseVisitorsReply(reply) {
	var visitors = [];
	if (!reply || reply.length == 0) {
		return visitors;
	}
	for(var i = 0; i<reply.length; i = i + 2) {
		visitors.push({playerId: reply[i], time: reply[i+1]});
	}
	return visitors;
}

function parseRedisResponse(err, playerId, replies, callback) {
	if (err) return callback(err, null);
	var retObj = getEmptyObject(playerId);
	retObj.count = parseCountReply(replies[0]);
	retObj.visitors = parseVisitorsReply(replies[1]);
	callback(null, retObj);
}

function getFromRedis(getData, callback) {
	var playerId = getData.playerId;
	var limit = getData.limit
	var multi = redis.multi();
	multi.get(getCountKey(playerId));
	multi.zrevrange(getVisitorsKey(playerId), 0, limit, 'WITHSCORES');
	multi.exec(function(err, replies) {
		parseRedisResponse(err, playerId, replies, callback);
	});
}

function canUpdateCount(playerId, visitorId, callback) {
	redis.zscore(getVisitorsKey(playerId), visitorId, function(err, time) {
		if (err) return callback(err, null);
		var can = (!time || (parseInt(time) + 24*3600 < functions.getTimestamp()));
		callback(err, can);
	});
}

function updateRedis(playerId, visitorId, callback) {
	canUpdateCount(playerId, visitorId, function(err, can) {
		if (err) return callback(err, null);
		var multi = redis.multi();
		if (can) {
			multi.incr(getCountKey(playerId));
		}
		var time = functions.getTimestamp();
		var visitorsKey = getVisitorsKey(playerId);
		
		multi.zadd(visitorsKey, time, visitorId);
		multi.zremrangebyscore(visitorsKey, 0, time - 24*3600*90);
		multi.expire(visitorsKey, 24*3600*90);
		
		multi.exec(callback);
	});
}

function remove(playerId, visitorToRemove, callback) {
	redis.zscore(getVisitorsKey(playerId), visitorToRemove, function(err, time) {
		if (err) return callback(err, 0);
		time = parseInt(time);
		if (!canRemoveVisitor(time)) {
			return callback(null, 0);
		}
		redis.zrem(getVisitorsKey(playerId), visitorToRemove, callback);
	});
}

function canRemoveVisitor(time) {
	return (time && time > functions.getTimestamp()-5*60);
}

module.exports.get = get;
module.exports.visit = visit;
module.exports.remove = remove;