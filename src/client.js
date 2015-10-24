'use strict';

var socket;

function setup() {
    socket = io();
}

function draw() {
    var rotation_speed = pRotationZ - rotationZ;

    if (rotation_speed != 0) {
        socket.emit('turn', rotation_speed);
    }
}
