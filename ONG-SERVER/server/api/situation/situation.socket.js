/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Situation = require('./situation.model');

exports.register = function(socket) {
  Situation.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Situation.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('situation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('situation:remove', doc);
}