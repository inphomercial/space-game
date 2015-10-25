var DEBUG = false;

var socket = io();

var game_state = {},
    game_props = {},
    ship_sprites = {},
    box,
    ship_images,
    map_image,
    black_hole_image,
    map_pixels,
    blue_flames,
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
    var notification = document.getElementById('notification'),
        canvas = document.getElementsByTagName('canvas')[0];

    function style(elem, style, value) {
        if (!elem) {
            return;
        }

        elem.style[style] = value;
    }

    if (msg === false) {
        style(notification, 'opacity', '0');
        style(canvas, 'opacity', '1');
    } else {
        notification.innerHTML = msg;
        style(notification, 'opacity', '1');
        style(canvas, 'opacity', '.3');
    }
}

function setup() {
    flames = loadAnimation('assets/ship-flame-1.png', 'assets/ship-flame-4.png');
    blue_flames = loadAnimation('assets/ship-flame-blue-1.png', 'assets/ship-flame-blue-4.png');

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

    black_hole_image = loadImage('assets/item-black-hole-1.png');

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
        box = createSprite(700, 545, 720, 460);
        box.draw = function () {
            // draw nothing
        }
        if(DEBUG){
            box.debug = true;
        }
    });

    socket.on('game:state', function(_game_state){
        console.info('[%s] state: %s', Date.now(), JSON.stringify(game_state, null, '  '));
        game_state = _game_state;
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

  socket.emit('display');

  textFont('Georgia');
  createCanvas(displayWidth, displayHeight);

  initStarField(200);
}

function draw() {
    background("#101f2e");

    game_state.players && game_state.players.forEach(function (player) {
        if(!ship_sprites[player.id]){
            ship_sprites[player.id] = createSprite(player.x, player.y, 35, 35);
        }
        imageMode(CENTER);
        ship_sprites[player.id].draw = function() {
            if(DEBUG){
                ship_sprites[player.id].debug = true;
            }
            this.position.x = player.x;
            this.position.y = player.y;
            push();
            rotate(player.rotation);
            image(ship_images[player.color],0,0);
            if(player.boost){
                animation(flames, -21, 0);
            } else {
                animation(blue_flames, -21, 0);
            }
            pop();
            ship_sprites[player.id].collide(box);
            player.x = this.position.x;
            player.y = this.position.y;
        };

        socket.emit('game:player:turn', {
            player_id: player.id,
            off_tracks: off_tracks(player),
            x: player.x,
            y: player.y
        });
    })

    var ship_ids = [];

    if(game_state.players) {
        ship_ids = game_state.players.map(function (d){ return d.id; });
    }

    for(var i = 0 ; i < ship_ids.length - 1; i++) {
        for(var t = i + 1 ; t < ship_ids.length; t++) {
            ship_sprites[ship_ids[i]].displace(ship_sprites[ship_ids[t]]);
        }
    }

    for( var ship_id in ship_sprites) {
        if(ship_sprites.hasOwnProperty(ship_id)){
            if (ship_ids.indexOf(ship_id) === -1){
                ship_sprites[ship_id].remove()
                delete ship_sprites[ship_id];
                console.log('ship_sprites removed: ' + ship_id);
            }
        }
    };

    stars.forEach(function(star) {
        star.update();
    });

    if(canSpawnShootingStar()) spawnShootingStar();
    shooting_stars.forEach(function(shooting_star, index) {
        shooting_star.shoot();
        if (shooting_star.life <= 0) {
            shooting_stars.splice(index, 1);
        }
    });

    if(canSpawnBlackHole()) spawnBlackHole();
    black_holes.forEach(function(hole, index) {
        hole.update();
        if (hole.timer <= 0) {
            black_holes.splice(index, 1);
        }
    });
    draw_game();
}

function randomHeightPosition() {
    return random(0, displayHeight);
};

function randomWidthPosition() {
    return random(0, displayWidth);
};

function draw_game() {
    render_map();
    drawSprites();
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

function keyPressed() {
    if (key === 'D') {
        DEBUG = !DEBUG;
        console.log('debug: ' + DEBUG);
    }
}
