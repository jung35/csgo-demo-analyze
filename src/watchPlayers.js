const demofile = require("demofile");

const watchPlayers = (demoFile, player_steam65Ids, watch_players) => {
  demoFile.entities.on("create", (e) => {
    // We're only interested in player entities being created.
    if (!(e.entity instanceof demofile.Player)) {
      return;
    }

    const steam65_id = e.entity.steam64Id;

    if (player_steam65Ids.indexOf(steam65_id) !== -1) {
      watch_players[steam65_id] = e.entity.userId;
    }
  });

  demoFile.entities.on("beforeremove", (e) => {
    if (!(e.entity instanceof demofile.Player)) {
      return;
    }

    const steam65_id = e.entity.steam64Id;

    if (player_steam65Ids.indexOf(steam65_id) !== -1) {
      delete watch_players[steam65_id];
    }
  });
};

module.exports = watchPlayers;
