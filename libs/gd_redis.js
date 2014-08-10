"use strict";

var redis = require('redis').createClient(null, null, {connect_timeout:100, enable_offline_queue: false});

module.exports = redis;