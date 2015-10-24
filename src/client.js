'use strict';

var socket;
var bg;

function setup() {
    socket = io();

    createCanvas(windowWidth, windowHeight);
    socket.on('player:props', function (props) {
        bg = props.color;
    });
}

function draw() {
    if (bg) {
        background(bg);
    }

    var rotation_speed = pRotationZ - rotationZ;

    if (rotation_speed != 0) {
        socket.emit('turn', rotation_speed);
    }
}
