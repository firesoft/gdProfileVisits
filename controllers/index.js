"use strict";

var gdConfig = require('../libs/gd_config.js');
var gdApp = require('../libs/gd_app.js');

function get(req, res, next) {

	var json = {
		status: 'online',
		name: gdConfig.get('name'),
		ip: gdConfig.get('ip'),
		port: gdConfig.get('port'),
		startTime: gdApp.getStartTime()
	}

	res.json(json);
}

module.exports.get = get;