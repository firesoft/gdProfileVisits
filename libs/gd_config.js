"use strict";

var fs = require('fs');
var _ = require('lodash');
var functions = require('./functions.js');
var pjson = require('../package.json');


var config = {
	ip: '0.0.0.0',
	port: '8088',
	name: (pjson.name || 'gd app')
};


function loadConfigs() {
	loadGlobalConfig();
	loadEnvConfig();	
}

function loadGlobalConfig() {
	var globalConfig = require('../confs/app_conf');
	mergeData(globalConfig);
}

function loadEnvConfig() {
	var env = functions.getEnv();
	
	if (fs.existsSync(__dirname + '/../confs/app_conf_' + env + '.js')) {
		var envConfig = require('../confs/app_conf_' + env);
		mergeData(envConfig);
	} else {
		console.log('No config file for ' + env + ' environment!');
	}
}

function getAll() {
	return _.clone(config);
}

function get(key) {
	if (_.has(config, key)) {
		return config[key];
	}
	return null;
}

function mergeData(newConfig) {
	_.extend(config, newConfig);
}

loadConfigs();

module.exports.getAll = getAll;
module.exports.get = get;