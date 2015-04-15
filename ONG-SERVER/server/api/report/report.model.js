'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReportSchema = new Schema({
  timestamp: String,
  report_data: Object
});

module.exports = mongoose.model('Report', ReportSchema);
