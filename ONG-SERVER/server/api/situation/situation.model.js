'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SituationSchema = new Schema({
  name: String,
  timestamp: String,
  situation: Object
});

module.exports = mongoose.model('Situation', SituationSchema);
