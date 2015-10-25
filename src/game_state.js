'use strict';

var GAME_STATE = {
    // waiting for players
    PREGAME: 0,

    // starting countdown
    READY: 1,

    // game in progress
    INPROGRESS: 2,

    // game ended and showing leader boards
    POSTGAME: 3,
};

if (typeof window === 'undefined') module.exports = GAME_STATE;
