const onPlayerDeath = require("./onPlayerDeath");
const onPlayerBlind = require("./onPlayerBlind");
const onRoundEnd = require("./onEndRound");
// const onPlayerHurt = require("./onPlayerHurt");

const playerStats = (demoFile, match_status, watch_players, stats) => {
  onPlayerDeath(demoFile, match_status, watch_players, stats);
  onPlayerBlind(demoFile, match_status, watch_players, stats);
  onRoundEnd(demoFile, match_status, watch_players, stats);
  // onPlayerHurt(demoFile, match_status, watch_players, stats);
};

module.exports = playerStats;
