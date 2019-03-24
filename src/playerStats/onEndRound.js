const newRoundPlayer = require("./newRoundPlayer");

module.exports = ({ demoFile, round_data, demo_info }) => {
  const rounds = demo_info.rounds.length;

  demoFile.entities.players.map((player) => {
    const steam64Id = player.steam64Id;
    const round_stats = player.matchStats[rounds];

    if (!round_stats) {
      return;
    }

    if (!round_data.players[steam64Id]) {
      round_data.players[steam64Id] = newRoundPlayer();
    }

    round_data.players[steam64Id].damage = round_stats.damage;
  });
};
