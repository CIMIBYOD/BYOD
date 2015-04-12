'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConfigurationSchema = new Schema({
  name: String,
  domain_name : String,
  xmpp_server : String,
  xmpp_broadcast_room : String,
  server_host : String,
  situation_from : String,
  situation_to : String,
  situation_ws : String,
  alert_ws : String,
  situation_sync: Number
});

module.exports = mongoose.model('Configuration', ConfigurationSchema);
