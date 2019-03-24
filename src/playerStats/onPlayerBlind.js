const initStats = require("./initStats");

const onPlayerBlind = (demoFile, match_status, stats) => {
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

    if (flasher.teamNumber === blind.teamNumber) {
      // team flash
      const flasher_steam64Id = flasher.steam64Id;

      if (!stats[flasher_steam64Id]) {
        stats[flasher_steam64Id] = initStats();
      }

      stats[flasher_steam64Id].teammates_flashed++;
      stats[flasher_steam64Id].teammates_flashed_duration += blind_duration;

      const blind_steam64Id = blind.steam64Id;

      if (!stats[blind_steam64Id]) {
        stats[blind_steam64Id] = initStats();
      }

      stats[blind_steam64Id].flashed_by_teammates++;
      stats[blind_steam64Id].flashed_by_teammates_duration += blind_duration;
    } else {
      // enemy flash
      const flasher_steam64Id = flasher.steam64Id;

      if (!stats[flasher_steam64Id]) {
        stats[flasher_steam64Id] = initStats();
      }

      stats[flasher_steam64Id].enemies_flashed++;
      stats[flasher_steam64Id].enemies_flashed_duration += blind_duration;

      const blind_steam64Id = blind.steam64Id;

      if (!stats[blind_steam64Id]) {
        stats[blind_steam64Id] = initStats();
      }

      stats[blind_steam64Id].flashed_by_enemies++;
      stats[blind_steam64Id].flashed_by_enemies_duration += blind_duration;
    }
  });
};

module.exports = onPlayerBlind;
