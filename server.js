'use strict';

var PORT = process.env.PORT || 3000;
var DEBUG = process.env.DEBUG || process.env.NODE_ENV === 'development';

var express = require('express');
var debug = require('debug');
var socket_io = require('socket.io');

var http = require('http');
var wildcard = require('socketio-wildcard');


var log_http = debug('server:http');
var log_socket = debug('server:socket');

var app = express();
var forward_all = wildcard();

var server_http = new http.Server(app);
var server_socket = socket_io(server_http);

var stats = {
    active: 0,
    total: 0
};

server_socket.use(forward_all);
app.set('views', __dirname + '/views/');
app.set('view engine', 'html');
app.set('view cache', DEBUG);

app.use('/node_modules', express.static('node_modules'));
app.get('/', function (req, res) { res.sendfile('client.html'); });
app.get('/stats', function (req, res) { res.json(stats); });

server_http.listen(PORT, function () { log_http('listeninig on port %s', PORT); });
server_socket.on('connection', function (socket) {
    stats.active++;
    stats.total++;

    socket.on('*', function (payload) { socket.broadcast.emit(payload.data[0], payload.data[1]); })
    socket.on('disconnect', function () { stats.active--; });
});
