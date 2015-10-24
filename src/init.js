'use strict';

var socket = io();

socket.on('greet', function () {
    console.log(arguments);
});
