var socket = io();

var game_state,
ships = [],
bullets = [],
stars = [],
shooting_stars = [];

var ship_images;

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

    socket.on('pregame', function( countdown ){
        background(100); // Clears Background
        textAlign(CENTER);
        noStroke();
        textStyle(ITALIC)
        textSize(30);
        text("JOIN THE NEXT ROUND", width/2, height/2 - 100);
        text("POINT YOUR MOBILE BROWSER TO:", width/2, height/2 - 50);
        textSize(50);
        text("192.168.1.6", width/2, height/2);
        textSize(70);
        text(countdown, width/2, height/2 + 70);
    });

    socket.on('postgame', function( winner ){
        background(100); // Clears Background
        textAlign(CENTER);
        noStroke();
        textStyle(ITALIC)
        textSize(30);
        text("GAME OVER", width/2, height/2 - 50);
        textSize(50);
        text(winner + " WINS!", width/2, height/2);
        textSize(70);
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

var checkForShootingStar = function() {
    if(Math.random() > .99) createShootingStar();
};

var createShootingStar = function() {
    var star = new Star(randomWidthPosition(), randomHeightPosition(), randomColor(), random(1, 8));
    star.life = random(0, 70);
    star.end_x = randomWidthPosition();
    star.end_y = randomHeightPosition();
    shooting_stars.push(star);
};

var randomColor = function() {
    var colors = ["#d3c484", "#42445c", "#8683d4"];
    return colors[Math.floor(Math.random() * colors.length)];
};

var randomHeightPosition = function() {
    return random(0, displayHeight);
};

var randomWidthPosition = function() {
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