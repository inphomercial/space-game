var socket = io();

var game_state,
    map,
    stars = [],
    shooting_stars = [],
    ship_images;

function setup() {
    ship_images = {
        'red' : loadImage('assets/ship-body-1.png'),
        'blue' : loadImage('assets/ship-body-1.png'),
        'orange' : loadImage('assets/ship-body-1.png'),
        'purple' : loadImage('assets/ship-body-1.png'),
        'pink' : loadImage('assets/ship-body-1.png'),
        'yellow' : loadImage('assets/ship-body-1.png'),
        'brown' : loadImage('assets/ship-body-1.png'),
        'cornsilk' : loadImage('assets/ship-body-1.png'),
        'paleturquoise' : loadImage('assets/ship-body-1.png'),
        'violet' : loadImage('assets/ship-body-1.png')
    }

    socket.emit('game:control');

    socket.on('game:props', function(game_props){
        map = game_props.map;
    });

    socket.on('game:state', function(_game_state){
        console.log('ships: ' + game_state);
        game_state = _game_state;
        debugger;
        draw_game();
    });

  socket.emit('display');

  textFont('Georgia');
  createCanvas(displayWidth, displayHeight);

  initStarField(200);
}

function draw() {
    background("#101f2e");

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
}

function Star(x, y, color, size) {
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
    this.size -= .02;
    this.life--;
    fill(this.color);
    rect(this.x, this.y, this.size, this.size);
};

function checkForShootingStar() {
    if(Math.random() > .99) createShootingStar();
};

function createShootingStar() {
    var star = new Star(randomWidthPosition(), randomHeightPosition(), randomColor(), random(1, 8));
    star.life = random(0, 70);
    star.end_x = randomWidthPosition();
    star.end_y = randomHeightPosition();
    shooting_stars.push(star);
};

function randomColor() {
    var colors = ["#d3c484", "#42445c", "#8683d4"];
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
    // background('CURRENT MAP');
    imageMode(CENTER);
    game_state.players.forEach( function (ship) {
        push();
        translate(ship.x, ship.y);
        rotate(ship.r);
        image(ship_images[ship.color],0,0);
        pop();
    });
}
