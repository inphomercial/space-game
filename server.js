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

var Game = require('./src/state');
var game = new Game({
    maxPlayers: 10
});

server_socket.use(forward_all);
app.set('views', __dirname + '/views/');
app.set('view engine', 'html');
app.set('view cache', DEBUG);

app.use('/node_modules', express.static('node_modules'));
app.use('/vendor', express.static('vendor'));
app.use('/src', express.static('src'));
app.get('/', function (req, res) { res.sendfile('client.html'); });

server_http.listen(PORT, function () { log_http('listeninig on port %s', PORT); });
server_socket.on('connection', function (socket) {
    var player;

    if (game.canAddPlayer()) {
        player = game.addPlayer(socket);

        socket.on('disconnect', function () {
            game.removePlayer(player);
        });

        socket.emit('player:props', player.props);
    } else {
        socket.emit('player:better-luck-next-time');
    }
});
