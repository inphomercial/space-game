'use strict';

var socket;
var bg;

function setup() {
    socket = io();

    createCanvas(windowWidth, windowHeight);

    socket.on('player:props', function (props) {
        bg = props.color;
    });

    socket.on('player:better-luck-next-time', function () {
        alert('better luck next time, kiddo');
    });
}

function draw() {
    if (bg) {
        background(bg);
    }

    var rotation_speed = pRotationZ - rotationZ;

    if (rotation_speed != 0) {
        socket.emit('player:turn', { rotation_speed: rotation_speed });
    }

    var boost_status = touchIsDown || mouseIsPressed;
    socket.emit('player:boost', { boost_on : boost_status });
}

function asController() {
    socket.emit('game:control');
    socket.on('game:state', function (state) {
        console.log('game state', state);
    });
}