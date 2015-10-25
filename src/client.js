'use strict';

var ROTATION_DAMPENING = 10;

var socket,
    player_info,
    ship_image,
    flame_sound;

function setup() {
    socket = io();
    player_info = {};

    flame_sound = loadSound('assets/sounds/farts.mp3');
    ship_image = document.getElementById('ship_image');

    socket.on('player:props', function (props) {
        player_info = props;
    });

    socket.on('player:better-luck-next-time', function () {
        alert('better luck next time, kiddo');
    });

    socket.on('player:control', function () {
        document.getElementById('start_game').style.display = 'block';
        document.getElementById('start_game').style.opacity = '1';

        document.getElementById('start_game').touchstart = stateReady;
        document.getElementById('start_game').onclick = stateReady;
    });

    socket.on('game:state:startingIn', function (timeleft) {
        if (timeleft) {
            message('starting game in ' + timeleft);
        } else {
            message('go!');
            setTimeout(function () {
                message(false);
            }, 500);
        }
    });

    socket.on('connect', function () {
        message(false);
    });

    socket.on('disconnect', function () {
        message('disconnected from server. trying to connect...');
        document.getElementById('start_game').style.display = 'none';
        document.getElementById('start_game').style.opacity = '0';
    });
}

function stateReady() {
    message('letting server know...');
    socket.emit('game:state:ready');
    document.getElementById('start_game').style.display = 'none';
    document.getElementById('start_game').style.opacity = '0';
}

function message(msg) {
    var notification = document.getElementById('notification');

    function style(elem, style, value) {
        if (!elem) {
            return;
        }

        elem.style[style] = value;
    }

    if (msg === false) {
        style(notification, 'opacity', '0');
    } else {
        notification.innerHTML = msg;
        style(notification, 'opacity', '1');
    }
}

function draw() {
    var turn = {
        rotation_speed: rotationX * -1 * 0.0174533 / ROTATION_DAMPENING,
        boost: touchIsDown || mouseIsPressed
    };

    socket.emit('player:turn', turn);
    document.body.style.backgroundColor = player_info.color;
    ship_image.src = turn.boost ?
        'assets/phone-ship-2.png' :
        'assets/phone-ship-1.png';
}

function touchStarted() {
    flame_sound.play();
    flame_sound.loop(10);
}

function touchEnded() {
    flame_sound.stop();
}
