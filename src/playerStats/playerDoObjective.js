const newRoundPlayer = require("./newRoundPlayer");

module.exports = ({ demoFile, round_data }, { userid }) => {
  const player = demoFile.entities.getByUserId(userid);

  if (!player) {
    // ?
    return;
  }

  const steam64Id = player.steam64Id;

  if (!round_data.players[steam64Id]) {
    round_data.players[steam64Id] = newRoundPlayer();
  }

  round_data.players[steam64Id].objective = true;
};
