'use strict';

var express = require('express');
var controller = require('./xmpp.controller');

var router = express.Router();

router.post('/broadcast', controller.broadcast);


module.exports = router;