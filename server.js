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
var Map = require('./src/map');

var game = new Game(new Map());

function pickOne(primary, backup, property) {
    return property in primary ? primary[property] : backup[property];
}

server_socket.use(forward_all);
app.set('views', __dirname + '/views/');
app.set('view engine', 'html');
app.set('view cache', DEBUG);

app.use('/node_modules', express.static('node_modules'));
app.use('/vendor', express.static('vendor'));
app.use('/assets', express.static('assets'));
app.use('/src', express.static('src'));
app.get('/', function (req, res) { res.sendfile('client.html'); });
app.get('/monitor', function (req, res) { res.sendfile('monitor.html'); });

server_http.listen(PORT, function () { log_http('listeninig on port %s', PORT); });
server_socket.on('connection', function (socket) {
    var player;

    if (game.canAddPlayer()) {
        player = game.addPlayer(socket);

        socket.on('disconnect', function () {
            if (player) {
                game.removePlayer(player);
            }
        });

        socket.on('player:turn', function (props) {
            player.props.boost = pickOne(props, player.props, 'boost');
            player.props.rotation_speed = pickOne(props, player.props, 'rotation_speed');
            player.props.vx = pickOne(props, player.props, 'vx');
            player.props.vy = pickOne(props, player.props, 'vy');
            player.props.x = pickOne(props, player.props, 'x');
            player.props.y = pickOne(props, player.props, 'y');

            player.update(game);
        });

        socket.emit('player:props', player.props);
    } else {
        socket.emit('player:better-luck-next-time');
    }

    // this is a monitor
    socket.on('game:control', function () {
        if (player) {
            game.removePlayer(player);
            player.props = undefined;
            player = undefined;
        }

        socket.emit('game:props', {
            map: game.map
        });

        setInterval(function () {
            socket.emit('game:state', game.getState());
        }, 1000);
    });
});
