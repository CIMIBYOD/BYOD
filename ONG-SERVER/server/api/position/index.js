'use strict';

var express = require('express');
var controller = require('./position.controller');

var router = express.Router();

router.put('/', controller.update);

module.exports = router;