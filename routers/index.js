"use strict";

var router = require('express').Router();

var indexController = require('../controllers/index.js');
router.get('/', indexController.get);
module.exports = router;