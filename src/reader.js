const fs = require("fs");
const demofile = require("demofile");

const watchPlayers = require("./watchPlayers");
const playerStats = require("./playerStats");
const lo3 = require("./lo3");

const player_steam65Ids = [
  "76561198020317127", // jung
  "76561198162875654", // tony
  "76561197993761807", // peter
  "76561198033939559", // mike
  "76561198035140517", // jinswag
  "76561198038246134", // sunny
  "76561197987777797", // dennis
  "76561198044967635", // henry
  "76561198018221215", // will
];

module.exports = function(filename, callback) {
  console.log(`[${process.pid}] STARTING:`, filename);

  fs.readFile(filename, (err, buffer) => {
    const local_stats = {};
    const watch_players = {};
    const match_status = { started: false, count: 0 };
    const demoFile = new demofile.DemoFile();

    lo3(demoFile, match_status);

    watchPlayers(demoFile, player_steam65Ids, watch_players);
    playerStats(demoFile, match_status, watch_players, local_stats);

    demoFile.on("start", () => {
      console.log(`[${process.pid}] start buffer`);
    });

    demoFile.on("end", () => {
      // Object.keys(local_stats).map((player) => {
      //   if (!stats[player]) {
      //     stats[player] = {};
      //   }

      //   Object.keys(local_stats[player]).map((player_stats) => {
      //     if (!stats[player][player_stats]) {
      //       stats[player][player_stats] = 0;
      //     }

      //     stats[player][player_stats] += local_stats[player][player_stats];
      //   });
      // });

      console.log(`[${process.pid}] DEMO DONE`);

      callback(null, local_stats);
    });

    demoFile.parse(buffer);
  });
  // callback(null, input + " BAR (" + process.pid + ")");
};
