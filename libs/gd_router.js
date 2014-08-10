"use strict";

var fs = require('fs');

function get() {
	var routeFiles = getRoutesFiles();
	return getRouters(routeFiles);
}

function getRoutesFiles() {
	var routeFiles = [];
	var files = fs.readdirSync(__dirname + '/../routers/');
	files.forEach(function(filename) {
		if (filename != '..' && filename != '.') {
			routeFiles.push(filename);
		}
	});
	return routeFiles;
}

function getRouters(routeFiles) {
	var routers = [];
	routeFiles.forEach(function(routeFile) {
		routers.push(getRoute(routeFile));
	});
	
	return routers;
}

function getRoute(filename) {
	return require('../routers/' + filename);
}

module.exports.get = get;