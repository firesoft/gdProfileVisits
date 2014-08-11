"use strict";

var router = require('express').Router();
var visitsGetController = require('../controllers/visits_get.js');
var visitsVisitController = require('../controllers/visits_visit.js');
var visitsRemoveController = require('../controllers/visits_remove.js');

router.get('/visits/:playerId', visitsGetController.validate, visitsGetController.get);
router.post('/visits/:playerId', visitsVisitController.validate, visitsVisitController.visit);
router.delete('/visits/:playerId', visitsRemoveController.validate, visitsRemoveController.remove);

module.exports = router;