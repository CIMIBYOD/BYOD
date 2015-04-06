/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Xmpp = require('./xmpp.model');

exports.register = function(socket) {
  Xmpp.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Xmpp.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('xmpp:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('xmpp:remove', doc);
}