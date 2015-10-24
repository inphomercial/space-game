'use strict';

var lodash = require('lodash');

/**
 * @constructor
 * @param {Object} props
 */

function PlayerProperties(props) {
    this.id = props.id;
    this.color = props.color;
    this.boost = props.boost;
    this.rotation_speed = props.rotation_speed;
    this.rotation = props.rotation;
    this.vx = props.vx;
    this.vy = props.vy;
    this.x = props.x;
    this.y = props.y;
}

/**
 * @constructor
 * @param {io} socket
 * @param {PlayerProperties} props
 */
function Player(socket, props) {
    this.socket = socket;
    this.props = props;
}


Player.prototype.update = function(game) {
    if(this.boost) {
        this.props.vx += game.boost_speed * Math.cos(this.props.rotation);
        this.props.vy += game.boost_speed * Math.sin(this.props.rotation);
    }

    // Bounce off the walls
    if( this.props.x + this.props.vx > width || this.props.x + this.props.vx < 0){
        this.props.vx *= -1;
    }
    if( this.props.y + this.props.vy > height || this.props.y + this.props.vy < 0){
        this.props.vy *= -1;
    }

    this.props.x += this.props.vx;
    this.props.y += this.props.vy;
    this.props.rotation += this.props.rotation_speed;
}

/**
 * @constructor
 * @param {Map} map
 */
function Game(map) {
    /**
     * tracks available colors
     */
    this.playerColors = [
        'red',
        'blue',
        'orange',
        'purple',
        'pink',
        'yellow',
        'brown',
        'cornsilk',
        'paleturquoise',
        'violet'
    ];

    /**
     * @type {Player[]}
     */
    this.players = [];

    /**
     * @type {Map}
     */
    this.map = map;

    /**
     * @type {Number}
     */
    this.boost_speed = 0.1;
}

/**
 * @param {io} socket
 * @return {Player}
 */
Game.prototype.addPlayer = function (socket) {
    var player, pindex, loc;

    player = new Player(socket, new PlayerProperties({
        id: socket.id,
        color: this.playerColors.shift()
    }));

    this.players.push(player);
    pindex = this.players.indexOf(player);
    loc = this.map.start_location.shift();

    player.props.x = loc[0];
    player.props.y = loc[1];

    return player;
};

/**
 * @param {Player}
 */
Game.prototype.removePlayer = function (player) {
    this.playerColors.push(player.props.color);
    this.map.start_location.push([ player.props.x, player.props.y ]);
    lodash.pull(this.players, player);
};

/**
 * @return {Boolean}
 */
Game.prototype.canAddPlayer = function () {
    return !!this.map.start_location.length;
};

Game.prototype.getState = function () {
    return {
        players: lodash.pluck(this.players, 'props')
    };
};

module.exports = Game;
module.exports.Player = Player;

if (require.main === module) {
    var game = new Game({ maxPlayers: 3 });
    var player1 = game.addPlayer({ id: Math.random() });
    var player2 = game.addPlayer({ id: Math.random() });
    console.log(JSON.stringify(game, null, '  '));
    console.log(JSON.stringify(player1, null, '  '));
    console.log(JSON.stringify(player2, null, '  '));
    game.removePlayer(player1);
    console.log(JSON.stringify(game, null, '  '));
    console.log(JSON.stringify(player2, null, '  '));
    console.log(JSON.stringify(game.getState()))
}
