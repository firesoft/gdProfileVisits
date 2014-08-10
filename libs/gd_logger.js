"use strict";

var winston = require('winston'); 
var winstonSentry = require('winston-sentry');
var raven = require('raven');
var gdConfig = require('./gd_config.js');

var logger = new (winston.Logger)({
	transports: [
		getConsoleTransport(),
		getSentryTransport()
	],
	exitOnError: false
});

function getConsoleTransport() {
	return new winston.transports.Console({
		prettyPrint: true,
		colorize: true,
		level: gdConfig.get('logLevel'),
		handleExceptions: true
	});
}

function getSentryTransport() {
	return new winstonSentry({
		level: gdConfig.get('logLevel'),
		raven: getRaven()
	});
}

function getRaven() {
	var ravenClient = new raven.Client(gdConfig.get('sentryUrl'));
	
	ravenClient.patchGlobal(function() {
		process.exit(1)
	});
	
	return ravenClient;
}

module.exports = logger;