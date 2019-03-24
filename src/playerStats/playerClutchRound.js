const newRoundPlayer = require("./newRoundPlayer");

module.exports = {
  onPlayerDeath: ({ demoFile, round_data }, evt) => {
    const userid = evt.userid; // only check the team of victim for efficiency

    const victim = demoFile.entities.getByUserId(userid);

    if (!victim || !victim.team) {
      return;
    }

    const alive_teammates = victim.team.members
      .map((player) => (player && player.isAlive ? player : null))
      .filter((v) => v);

    if (alive_teammates.length !== 1) {
      return;
    }

    const clutch_player = alive_teammates[0];

    if (!round_data.players[clutch_player.steam64Id]) {
      round_data.players[clutch_player.steam64Id] = newRoundPlayer();
    } else {
      const clutch_data = round_data.players[clutch_player.steam64Id];
      if (
        clutch_data["1v5"] ||
        clutch_data["1v4"] ||
        clutch_data["1v3"] ||
        clutch_data["1v2"] ||
        clutch_data["1v1"]
      ) {
        return;
      }
    }

    const alive_enemies = demoFile.teams[clutch_player.teamNumber === 2 ? 3 : 2].members
      .map((player) => (player.isAlive ? player : null))
      .filter((v) => v);

    if (alive_enemies.length === 0) {
      return;
    }

    round_data.players[clutch_player.steam64Id][`1v${alive_enemies.length}`] = true;
  },
};
