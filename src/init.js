'use strict';

var socket = io();

socket.on('game:player:joined', function (guid) {
    console.log('a new player joined the game', guid);
});

socket.on('game:player:left', function (guid) {
    console.log('a player left the game', guid);
});

socket.emit('game:join');
