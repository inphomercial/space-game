var socket = io();

var millis = function () {
  return Date.now();
};

function SpaceWarsGame () {
  this.ships = [];
  this.bullets = [];
  this.width = 1280;
  this.height = 720;
  this.max_speed = 3;
  this.boost_speed = 0.1;

  this.pregame_millis = 10000;
  this.postgame_millis = 10000;
  this.game_state_timer = 0;

  this.PREGAME = 0;
  this.GAME = 1;
  this.POSTGAME = 2;

  this.game_state = this.PREGAME;
  this.game_state_timer = millis() + this.pregame_millis;

}

SpaceWarsGame.prototype.update = function () {
  switch (this.game_state) {

    case this.PREGAME:
      var countdown = Math.floor((this.game_state_timer - millis()) / 1000);
      if (countdown > 0){
        io.sockets.emit('pregame', countdown);
      } else {
        this.game_state = this.GAME;
        console.log(this.game_state);
      }
      break;

    case this.GAME:
      // Update ships
      if( this.ships ) {
        for (var i = this.ships.length - 1; i >= 0; i--) {
          this.ships[i].update();
          if(this.ships[i].isDead()) {
            this.ships.splice(i, 1);
          }
        }
        io.sockets.emit('ship_data', this.ships);
      }

      if( this.ships.length < 2){
        this.game_state = this.POSTGAME;
        console.log(this.game_state);
        this.game_state_timer = millis() + this.postgame_millis;
        console.log("Game Over");
      }
      break;

    case this.POSTGAME:
      var countdown = Math.floor((this.game_state_timer - millis()) / 1000);
      if (countdown > 0){
        var winner = "Nobody";
        if (this.ships.length > 0){
          winner = 'id: ' + this.ships[0].id;
        }
        io.sockets.emit('postgame', winner);
      } else {
        this.game_state = this.PREGAME;
        console.log(this.game_state);
        this.game_state_timer = millis() + this.pregame_millis;
      }
      break;

    default:
      console.log("Sorry, something went wrong " + this.game_state);
      break;
  }
};

SpaceWarsGame.prototype.hitCheck = function () {
  // checks if ships or bullets have collided
  this.ships.forEach( function (ship) {
    this.bullets.forEach ( function (bullet) {
      if(dist(ship.x, ship.y, bullet.x, bullet.y) < 8) {
        console.log(ship.id + " hit!");
        ship.dead = true;
        bullet.dead = true;
      }
    });
  }, this);

};

SpaceWarsGame.prototype.newShip = function (id) {
  var newShip = new Ship(id);
  this.ships.push(newShip);
  console.log('new ship added: ' + id);
  // add a new ship with an id
};

SpaceWarsGame.prototype.destroyShip = function (id) {
  this.ships = this.ships.filter( function (ship){
    return ship.id !== id;
  });
};

function dist (x1, y1, x2, y2) {
  var d = Math.sqrt( Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2) );
  return d;
}

function Ship (_id) {
  this.id = _id;
  this.x = game.width * Math.random();
  this.y = game.height * Math.random();
  this.r = (2 * Math.PI) * Math.random();
  this.vx = 2 * Math.random();
  this.vy = 2 * Math.random();
  this.dead = false;
}

Ship.prototype.update = function () {
  this.x += this.vx;
  this.y += this.vy;

  // Keep in bounds
  if(this.x > game.width) {
    this.x = 0;
  } else if (this.x < 0) {
    this.x = game.width;
  }

  if(this.y > game.height) {
    this.y = 0;
  } else if (this.y < 0) {
    this.y = game.height;
  }
}

Ship.prototype.boost = function () {
  this.vx += game.boost_speed * Math.cos(this.r);
  this.vy += game.boost_speed * Math.sin(this.r);

  if(this.speed > game.max_speed) {
    var vector = createVector(this.vx, this.vy);
    vector.normalize();
    vector.mult(game.max_speed);
    this.vx = vector.x;
    this.vy = vector.y;
  }
};

Ship.prototype.speed = function () {
  return Math.sqrt(Math.sqr(this.vx) + Math.sqr(this.vy));
};

Ship.prototype.isDead = function () {
  return this.dead;
};

function Bullet (ship_id, x, y, r) {
  this.ship_id = ship_id;
  this.x = x;
  this.y = y;
  this.r = r;

  // move the bullet away from the ship that shot it so it doesn't instantly blow up
  this.x += 8 * Math.cos(this.r);
  this.y += 8 * Math.sin(this.r);

  this.vx = 5 * Math.cos(this.r);
  this.vy = 5 * Math.sin(this.r);
  this.timer = game.bullet_length;
  this.dead = false;
}

function getShip(id) {
  for (var i = game.ships.length - 1; i >= 0; i--) {
    if(game.ships[i].id == id) {
      return game.ships[i];
    }
  }
  return undefined;
}

var game = new SpaceWarsGame();
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
var display_socket;

io.sockets.on('connection',
  function (socket) {
    game.newShip(socket.id);

    socket.on('disconnect', function() {
      if(getShip(socket.id)) {
        game.destroyShip(this.id);
      }
    });

    socket.on('display', function() {
      display_socket = this;
      game.destroyShip(this.id);
    });

    socket.on('shoot',
      function() {
        var thisShip = getShip(this.id);
        if(thisShip){
          var bullet = new Bullet(thisShip.id, thisShip.x, thisShip.y, thisShip.r);
          game.bullets.push(bullet);
        }
      });

    socket.on('move_left',
      function () {
        var thisShip = getShip(this.id);
        thisShip.r += -0.05;
      });

    socket.on('move_right',
      function () {
        var thisShip = getShip(this.id);
        thisShip.r += 0.05;
      });

    socket.on('boost',
      function () {
        var thisShip = getShip(this.id);
        thisShip.boost();
      });
  }
);

setInterval(game.update.bind(game), 15);

console.log('listening on port 8080');