'use strict';

var express = require('express');
var controller = require('./situation.controller');

var router = express.Router();

router.post('/', controller.get);


module.exports = router;
