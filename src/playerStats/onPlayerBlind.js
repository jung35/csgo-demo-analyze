const initStats = require("./initStats");

const onPlayerBlind = (demoFile, match_status, watch_players, stats) => {
  demoFile.gameEvents.on("player_blind", ({ userid, attacker, blind_duration }) => {
    if (!match_status.started) {
      return;
    }

    const flasher = demoFile.entities.getByUserId(attacker);
    const blind = demoFile.entities.getByUserId(userid);

    if (!flasher || !blind) {
      // whats userid with 0?
      console.log("player_blind", `[${userid}]`, `[${attacker}]`, blind_duration);

      return;
    }

    if (!watch_players[flasher.steam64Id] && !watch_players[blind.steam64Id]) {
      return; // nothing to look at
    }

    if (flasher.teamNumber === blind.teamNumber) {
      // team flash
      if (watch_players[flasher.steam64Id]) {
        const steam64Id = flasher.steam64Id;

        if (!stats[steam64Id]) {
          stats[steam64Id] = initStats();
        }

        stats[steam64Id].teammates_flashed++;
        stats[steam64Id].teammates_flashed_duration += blind_duration;
      }

      if (watch_players[blind.steam64Id]) {
        const steam64Id = blind.steam64Id;

        if (!stats[steam64Id]) {
          stats[steam64Id] = initStats();
        }

        stats[steam64Id].flashed_by_teammates++;
        stats[steam64Id].flashed_by_teammates_duration += blind_duration;
      }
    } else {
      // enemy flash
      if (watch_players[flasher.steam64Id]) {
        const steam64Id = flasher.steam64Id;

        if (!stats[steam64Id]) {
          stats[steam64Id] = initStats();
        }

        stats[steam64Id].enemies_flashed++;
        stats[steam64Id].enemies_flashed_duration += blind_duration;
      }

      if (watch_players[blind.steam64Id]) {
        const steam64Id = blind.steam64Id;

        if (!stats[steam64Id]) {
          stats[steam64Id] = initStats();
        }

        stats[steam64Id].flashed_by_enemies++;
        stats[steam64Id].flashed_by_enemies_duration += blind_duration;
      }
    }
  });
};

module.exports = onPlayerBlind;
