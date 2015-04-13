'use strict';

var _ = require('lodash');
var Xmpp = require('./xmpp.model');
var xmppclient = require('node-xmpp');

//XMPP Account Details Starts from Here
var client_id = "server@ong.cimicop.org"; //Use any XMPP Supported Account like Gmail
var client_pwd = "server";
var client_host = "127.0.0.1";  //talk.google.com for gmail
var client_port = "5222";   //5222 for gmail
var status_msg = "I am Online";   //Set it as you want
var room_jid = 'france@conference.ong.cimicop.org';
var room_nick = 'server';
//XMPP Account Details End Here

//Now Creating XMPP Client
var client = new xmppclient.Client({
  jid: client_id,
  password: client_pwd,
  host: client_host,
  port: client_port,
  reconnect: true
});

client.connection.socket.setTimeout(0)
client.connection.socket.setKeepAlive(true, 1000)
//Client Created

client.on('online', function() {
    console.log('Client is online');

    client.send(new xmppclient.Element('presence', { to: room_jid +'/' + room_nick })
      .c('x', { xmlns: 'http://jabber.org/protocol/muc' })
    );

  /*
    client.send(new xmppclient.Element('message', { to: room_jid, type: 'groupchat' })
      .c('body').t('test')
    );
    */


});

client.on('offline', function () {
    console.log('Client is offline');
});


client.on('connect', function () {
    console.log('Client is connected');
});

client.on('reconnect', function () {
    console.log('Client reconnects …');
});

client.on('disconnect', function (e) {
    console.log('Client is disconnected', client.connection.reconnect, e);
});


client.on('error', function(e) {
    console.error(e);
    process.exit(1);
});

process.on('exit', function () {
    client.end();
});

client.on('stanza', function(stanza) {
    console.log('stanza' + stanza);
})

exports.broadcast = function(req, res) {
    console.log(req);

    var payload = req.body.payload;

    client.send(new xmppclient.Element('message', { to: room_jid, type: 'groupchat' })
        .c('body').t(JSON.stringify(payload))
    );
    return res.json("sent");
};

exports.send = function(req, res) {
  var to = req.body.to;
  var payload = req.body.payload;

  client.send(new xmppclient.Element('message', { to: to, type: 'chat' })
      .c('body').t(JSON.stringify(payload))
  );
  return res.json("sent");
};

function handleError(res, err) {
  return res.send(500, err);
}
