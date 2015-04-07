'use strict';

var express = require('express');
var controller = require('./location.controller');

var router = express.Router();

router.put('/', controller.update);
router.put('/test', controller.test);

module.exports = router;
