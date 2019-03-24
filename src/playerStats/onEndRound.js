const initStats = require("./initStats");

let timer = 0;

const onRoundEnd = (demoFile, match_status, watch_players, stats) => {
  demoFile.gameEvents.on("round_end", () => {
    timer = demoFile.currentTime;
  });

  demoFile.gameEvents.on("round_end", () => {
    if (!match_status.started) {
      return;
    }

    Object.values(watch_players).map((userid) => {
      const player = demoFile.entities.getByUserId(userid);
      if (!player) {
        return;
      }

      const steam64Id = player.steam64Id;
      if (!stats[steam64Id]) {
        stats[player.steam64Id] = initStats();
      }

      switch (stats[steam64Id].temp_kills) {
        case 2:
          stats[steam64Id]["2k"]++;
          break;
        case 3:
          stats[steam64Id]["3k"]++;
          break;
        case 4:
          stats[steam64Id]["4k"]++;
          break;
        case 5:
          stats[steam64Id]["5k"]++;
          break;
      }

      const round_stats = player.matchStats[stats[steam64Id].rounds % 30];

      if (round_stats.liveTime !== 0) {
        stats[steam64Id].time_alive += round_stats.liveTime;
      } else {
        stats[steam64Id].time_alive += demoFile.currentTime - timer;
      }

      stats[steam64Id].damage += round_stats.damage;
      stats[steam64Id].temp_kills = 0;

      stats[steam64Id].rounds++;

      if (player.teamNumber === 2) {
        stats[steam64Id].rounds_t++;
      } else if (player.teamNumber === 3) {
        stats[steam64Id].rounds_ct++;
      }
    });
  });

  demoFile.gameEvents.on("round_officially_ended", () => {
    if (!match_status.started) {
      return;
    }

    Object.values(watch_players).map((userid) => {
      const player = demoFile.entities.getByUserId(userid);
      if (!player) {
        return;
      }

      const steam64Id = player.steam64Id;
      if (!stats[steam64Id]) {
        stats[player.steam64Id] = initStats();

        return;
      }

      stats[steam64Id].temp_kills = 0;
    });
  });

  demoFile.gameEvents.on("bomb_defused", ({ userid }) => {
    if (!match_status.started) {
      return;
    }

    const defuser = demoFile.entities.getByUserId(userid);
    if (!defuser || !watch_players[defuser.steam64Id]) {
      return;
    }

    const steam64Id = defuser.steam64Id;

    if (!stats[steam64Id]) {
      stats[steam64Id] = initStats();
    }

    stats[steam64Id].bombs_defused++;
  });

  demoFile.gameEvents.on("bomb_planted", ({ userid }) => {
    if (!match_status.started) {
      return;
    }

    const planter = demoFile.entities.getByUserId(userid);
    if (!planter || !watch_players[planter.steam64Id]) {
      return;
    }

    const steam64Id = planter.steam64Id;

    if (!stats[steam64Id]) {
      stats[steam64Id] = initStats();
    }

    stats[steam64Id].bombs_planted++;
  });
};

module.exports = onRoundEnd;
