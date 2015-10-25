var DEBUG = true;

var socket = io();

var game_state = {},
    game_props = {},
    stars = [],
    shooting_stars = [],
    ship_images,
    map_image,
    map_pixels,
    flames;

function off_tracks(player) {
    var pixels, off = false;

    if (map_pixels) {
        pixels = map_pixels(player.x, player.y);
        off = Math.max.apply(Math, pixels) === 0;
    }

    return off;
}

function message(msg) {
    var notification = document.getElementById('notification');

    if (!notification) {
        return;
    }

    if (msg === false) {
        notification.style.display = 'none';
    } else {
        notification.innerText = msg;
        notification.style.display = 'block';
    }
}

function setup() {
    flames = loadAnimation('assets/ship-flame-1.png', 'assets/ship-flame-4.png');

    ship_images = {
        '#ff0056' : loadImage('assets/ship-body-1.png'),
        '#00bbff' : loadImage('assets/ship-body-2.png'),
        '#ff2bce' : loadImage('assets/ship-body-3.png'),
        '#00cf18' : loadImage('assets/ship-body-4.png'), 
        '#ffb82a' : loadImage('assets/ship-body-5.png'),
        '#02c9bf' : loadImage('assets/ship-body-6.png'),
        '#7429ff' : loadImage('assets/ship-body-7.png'),
        '#ffffff' : loadImage('assets/ship-body-8.png'),
        '#faed22' : loadImage('assets/ship-body-9.png'),
        'violet' : loadImage('assets/ship-body-10.png')
    }

    socket.on('connect', function () {
        socket.emit('game:control');
        message(false);
    });

    socket.on('disconnect', function () {
        message("disconnected from server. trying to connect...")
    });

    socket.on('game:props', function(_game_props){
        var context;
        game_props = _game_props;
        map_image = loadImage(game_props.map.map_image);
        context = map_image.canvas.getContext('2d');
        map_pixels = function (x, y) {
            return context.getImageData(x, y, 1, 1).data;
        };
    });

    socket.on('game:state', function(_game_state){
        console.info('[%s] ships: %s', Date.now(), JSON.stringify(game_state.players, null, '  '));
        game_state = _game_state;
    });

  socket.emit('display');

  textFont('Georgia');
  createCanvas(displayWidth, displayHeight);

  initStarField(200);
}

function draw() {
    background("#101f2e");

    if (game_state.players) {
        game_state.players.forEach(function (player) {
            socket.emit('game:player:turn', {
                player_id: player.id,
                off_tracks: off_tracks(player)
            });
        });
    }

    stars.forEach(function(star) {
        star.update();
    });

    checkForShootingStar();
    shooting_stars.forEach(function(shooting_star, index) {
        shooting_star.shoot();
        if (shooting_star.life <= 0) {
            shooting_stars.splice(index, 1);
        }
    });

    draw_game();
}

function Star(x, y, color, size) {
    // console.log(color);
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.timer = random(0, .3);
}

Star.prototype.update = function() {
    rectMode(CENTER);
    fill(this.color);
    noStroke();
    size = noise(frameCount * this.timer, this.x, this.y) * 5;
    rect(this.x, this.y, size, size);
};

Star.prototype.shoot = function() {
    this.x = lerp(this.x, this.end_x, .01);
    this.y = lerp(this.y, this.end_y, .01);
    this.size -= .04;
    this.life--;
    fill(this.color, this.life/2);
    rect(this.x, this.y, this.size, this.size);
};

function checkForShootingStar() {
    if(Math.random() > .99) createShootingStar();
};

function createShootingStar() {
    var star = new Star(randomWidthPosition(), randomHeightPosition(), randomColor(), random(1, 8));
    star.life = random(20, 150);
    star.end_x = randomWidthPosition();
    star.end_y = randomHeightPosition();
    shooting_stars.push(star);
};

function randomColor() {
    // "#d3c484", "#42445c", "#8683d4"];
    var a = color('rgb(211, 196, 132)');
    var b = color('rgb(66, 68, 92)');
    var c = color('rgb(134, 131, 212)');
    var colors = [a, b, c];

    return colors[Math.floor(Math.random() * colors.length)];
};

function randomHeightPosition() {
    return random(0, displayHeight);
};

function randomWidthPosition() {
    return random(0, displayWidth);
};

function initStarField(num) {
    while (num--) {
        size = random(1, 8);
        var star = new Star(randomWidthPosition(), randomHeightPosition(), randomColor(), size);
        stars.push(star);
    }
};

function draw_game() {
    render_map();
    imageMode(CENTER);

    game_state.players && game_state.players.forEach( function (ship) {
        push();
        translate(ship.x, ship.y);
        rotate(ship.rotation);
        image(ship_images[ship.color],0,0);
        if(ship.boost){
            animation(flames, -21, 0);
        }
        pop();
    });
}

function render_map() {
    if (!game_props.map) {
        return;
    }

    // ADD img(map_layer) stuff here
    if (DEBUG) {
        strokeWeight(10);
        stroke(255, 120);
        noFill();
        beginShape(POINTS);
        game_props.map.track_points.forEach(function (point){
            vertex(point[0], point[1]);
        });
        endShape(CLOSE);
    }

    imageMode(CORNER);
    image(map_image,0,0);
}
