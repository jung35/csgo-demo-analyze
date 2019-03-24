const initStats = require("./initStats");

const onPlayerDeath = (demoFile, match_status, watch_players, stats) => {
  demoFile.gameEvents.on("player_death", ({ userid, attacker, assister, weapon, headshot }) => {
    if (!match_status.started || weapon === "world" || weapon === "worldspawn") {
      return;
    }

    const killer = demoFile.entities.getByUserId(attacker);
    const dead = demoFile.entities.getByUserId(userid);
    const assist = assister ? demoFile.entities.getByUserId(assister) : {};

    if (!killer) {
      console.log("\n\n\n|", attacker, "|", weapon, "|\n\n\n");
    }

    // record kills
    if (watch_players[killer.steam64Id]) {
      const steam64Id = killer.steam64Id;

      if (!stats[steam64Id]) {
        stats[steam64Id] = initStats();
      }

      if (!stats[steam64Id][`wp_${weapon}`]) {
        stats[steam64Id][`wp_${weapon}`] = 0;
        stats[steam64Id][`wp_${weapon}_hs`] = 0;
      }

      stats[steam64Id].temp_kills++;
      stats[steam64Id].kills++;
      stats[steam64Id][`wp_${weapon}`]++;

      if (headshot) {
        stats[steam64Id].headshots++;
        stats[steam64Id][`wp_${weapon}_hs`]++;
      }
    }

    // record assist
    if (watch_players[assist.steam64Id]) {
      const steam64Id = assist.steam64Id;

      if (!stats[steam64Id]) {
        stats[steam64Id] = initStats();
      }

      stats[steam64Id].assists++;
    }

    //record deaths
    if (watch_players[dead.steam64Id]) {
      const steam64Id = dead.steam64Id;

      if (!stats[steam64Id]) {
        stats[steam64Id] = initStats();
      }

      stats[steam64Id].deaths++;
    }
  });
};

module.exports = onPlayerDeath;
