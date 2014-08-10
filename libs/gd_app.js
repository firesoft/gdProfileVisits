"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var morgan = require('morgan');

var gdLogger = require('./gd_logger.js');
var gdConfig = require('./gd_config.js');
var functions = require('./functions.js');


function gdApp() {
	var expressApp = express();
	var startTime = functions.getTimestamp();
	
	function initExpress() {
		initMiddleware();
		initHttpServer();
	}
	
	function initHttpServer() {
		expressApp.disable('etag');
		expressApp.listen(gdConfig.get('port'), gdConfig.get('ip'), function() {
			gdLogger.info(gdConfig.get('name') + ' listening on ' + gdConfig.get('ip') + ':' + gdConfig.get('port'));
		});
	}

	function initMiddleware() {
		if (gdConfig.get('useAccessLog')) {
			expressApp.use(morgan('short'));
		}
		expressApp.use(bodyParser.json());
		expressApp.use(bodyParser.urlencoded({
			extended: true
		}));
		expressApp.use(expressValidator());
		expressApp.use(methodOverride());

		expressApp.use(getMiddlewareHandler('headers'));
		
		initRoutes();
		
		expressApp.use(getMiddlewareHandler('404'));
		expressApp.use(getMiddlewareHandler('error'));
	}

	function getMiddlewareHandler(middleware) {
		var middleware = require('../middlewares/' + middleware);
		return middleware.getHandler();
	}

	function initRoutes() {
		var routers = require('./gd_router').get();
		routers.forEach(function(router) {
			expressApp.use('', router);
		});
	}
	
	this.start = function() {
		initExpress();
	}
	
	this.getStartTime = function() {
		return startTime;
	}
}

module.exports = new gdApp();