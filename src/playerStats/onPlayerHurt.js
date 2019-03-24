const initStats = require("./initStats");

const onPlayerHurt = (demoFile, match_status, watch_players, stats) => {
  demoFile.gameEvents.on("player_hurt", ({ userid, attacker, weapon, dmg_health }) => {
    if (!match_status.started || weapon === "world" || !weapon) {
      return;
    }

    const hurter = demoFile.entities.getByUserId(attacker);

    if (watch_players[hurter.steam64Id]) {
      const steam64Id = hurter.steam64Id;

      if (!stats[steam64Id]) {
        stats[hurter.steam64Id] = initStats();
      }

      if (userid === attacker) {
        stats[steam64Id].self_harm += Math.min(dmg_health, 100);
      } else {
        // stats[steam64Id].damage += dmg_health;
      }
    }
  });
};

module.exports = onPlayerHurt;
