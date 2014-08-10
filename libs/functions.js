"use strict";

var util = require('util');
var _ = require('lodash');

function getEnv() {
	if (process.env.NODE_ENV) {
		return process.env.NODE_ENV;
	}
	return 'dev';
}

function isProductionEnv() {
	return (getEnv() == 'production');
}

function getTimestamp() {
	return Math.round(Date.now()/1000);
}

function getMillitime() {
	var hrTime = process.hrtime();
	return Math.round(hrTime[0]*1000 + hrTime[1] / 1000000);
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function isObjectMatch(obj, params) {
	for(var key in params) {
		if (!obj.hasOwnProperty(key)) {
			return false;
		}
		var value = params[key];
		if (util.isArray(value)) {
			if (value.indexOf(obj[key]) == -1) {
				return false;
			}
			continue;
		}
		if (value != obj[key]) {
			return false;
		}
	}
	return true;
}

function clone(obj) {
	var newObj = {};
	for(var key in obj) {
		var val = obj[key];
		if (typeof val != 'function') {
			newObj[key] = val;
		}
	}
	return newObj;
}

module.exports.getEnv = getEnv;
module.exports.isProductionEnv = isProductionEnv;
module.exports.getTimestamp = getTimestamp;
module.exports.getMillitime = getMillitime;
module.exports.randomInt = randomInt;
module.exports.isObjectMatch = isObjectMatch;
module.exports.clone = clone;