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
    this.rotation_speed = props.rotation_speed || 0;
    this.rotation = props.rotation || 0;
    this.vx = props.vx || 0;
    this.vy = props.vy || 0;
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
    var mag;

    if(this.props.boost) {
        this.props.vx += game.boost_speed * Math.cos(this.props.rotation);
        this.props.vy += game.boost_speed * Math.sin(this.props.rotation);
    }

    // Bounce off the walls
    if( this.props.x + this.props.vx > 1920 || this.props.x + this.props.vx < 0){
        this.props.vx *= -1;
    }
    if( this.props.y + this.props.vy > 1080 || this.props.y + this.props.vy < 0){
        this.props.vy *= -1;
    }

    var max_speed = this.props.off_tracks ? 1 : 6;
    mag = Math.sqrt(Math.pow(this.props.vx, 2) + Math.pow(this.props.vy, 2));
    // console.log('mag: ', mag);
    if (mag > max_speed) {
        this.props.vx = (this.props.vx / mag) * max_speed;
        this.props.vy = (this.props.vy / mag) * max_speed;
    }

    this.props.x += this.props.vx;
    this.props.y += this.props.vy;
    // console.log(this.props);
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
        // red: #ff0056; blue: #00bbff; pink: #ff2bce; green: #00cf18; orange: #ffb82a; teal: #02c9bf; purple: #7429ff; white: #ffffff; yellow: #faed22;
        '#ff0056',
        '#00bbff',
        '#ff2bce',
        '#00cf18',
        '#ffb82a',
        '#02c9bf',
        '#7429ff',
        '#ffffff',
        '#faed22',
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
 * @param {String} id
 * @return {Player}
 */
Game.prototype.getPlayer = function (id) {
    return lodash.find(this.players, function (player) {
        return player.props.id === id;
    });
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
    var game = new Game({ start_location: [[], []] });
    var player1 = game.addPlayer({ id: Math.random() });
    var player2 = game.addPlayer({ id: Math.random() });
    console.log(JSON.stringify(game, null, '  '));
    console.log(JSON.stringify(player1, null, '  '));
    console.log(JSON.stringify(player2, null, '  '));
    game.removePlayer(player1);
    console.log(JSON.stringify(game, null, '  '));
    console.log(JSON.stringify(player2, null, '  '));
    console.log(JSON.stringify(game.getState()))
    console.log(JSON.stringify(game.getPlayer(player2.props.id)));
}
