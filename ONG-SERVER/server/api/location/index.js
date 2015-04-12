'use strict';

var express = require('express');
var controller = require('./location.controller');

var router = express.Router();

router.put('/', controller.update);

module.exports = router;
