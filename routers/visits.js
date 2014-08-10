"use strict";

var router = require('express').Router();
var visitsGetController = require('../controllers/visits_get.js');
var visitsVisitController = require('../controllers/visits_visit.js');

router.get('/visits/:playerId', visitsGetController.validate, visitsGetController.get);
router.post('/visits/:playerId', visitsVisitController.validate, visitsVisitController.visit);

module.exports = router;