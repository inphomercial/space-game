'use strict';

var lodash = require('lodash');

var colors = [
    'red',
    'blue',
    'orange',
    'purple',
    'pink',
    'yellow',
    'white',
    'brown',
];

/**
 * @constructor
 * @param {Object} props
 */
function GameConfiguration(props) {
    this.maxPlayers = props.maxPlayers;
}

/**
 * @constructor
 * @param {Object} props
 */
function PlayerProperties(props) {
    this.color = props.color;
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

/**
 * @constructor
 */
function Game(config) {
    /**
     * tracks how many players this game has had
     */
    this.playerTick = 0;

    /**
     * @type {Player[]}
     */
    this.players = [];

    /**
     * @type {GameConfiguration}
     */
    this.config = new GameConfiguration(config);
}

/**
 * @param {io} socket
 * @return {Player}
 */
Game.prototype.addPlayer = function (socket) {
    var player = new Player(socket, new PlayerProperties({
        color: colors[this.playerTick++]
    }));

    this.players.push(player);
    return player;
};

/**
 * @param {Player}
 */
Game.prototype.removePlayer = function (player) {
    lodash.pull(this.players, player);
};

/**
 * @return {Boolean}
 */
Game.prototype.canAddPlayer = function () {
    return this.players.length < this.config.maxPlayers;
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
}