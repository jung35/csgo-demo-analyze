const fs = require("fs");
const demofile = require("demofile");

const lo3 = require("./lo3");

const newRound = require("./playerStats/newRound");

const assignTeams = require("./playerStats/assignTeams");
const onPlayerDeath = require("./playerStats/onPlayerDeath");
const playerEntryKill = require("./playerStats/playerEntryKill");
const playerDoObjective = require("./playerStats/playerDoObjective");
// const onPlayerBlind = require("./playerStats/onPlayerBlind");
// const onRoundEnd = require("./playerStats/onEndRound");

module.exports = function({ demo_file_path, data_file_path }, callback) {
  console.log(`[${process.pid}] STARTING:`, demo_file_path);

  fs.readFile(demo_file_path, (err, buffer) => {
    const match_status = { started: false, count: 0, got_players: false };
    const demo_info = {
      date: fs.statSync(demo_file_path).birthtime,
      map: null,
      team1_name: null,
      team2_name: null,
      team1_players: {},
      team2_players: {},
      rounds: [],
      rounds_end: [],
    };

    // new data every new round
    let round_data = null;

    // garbage data to be stored and refreshed each round
    let tmp_round = {};

    const demoFile = new demofile.DemoFile();

    // onPlayerDeath(demoFile, match_status, local_stats);
    // onPlayerBlind(demoFile, match_status, local_stats);
    // onRoundEnd(demoFile, match_status, local_stats);

    demoFile.gameEvents.on("round_start", () => {
      tmp_round = {};

      if (!match_status.started) {
        lo3.onRoundStart({ match_status });

        // check to see if lo3 happened
        if (!match_status.started) {
          return;
        }
      }

      if (!match_status.got_players) {
        assignTeams({ demoFile, match_status, demo_info });
      }

      round_data = newRound(demoFile);
    });

    demoFile.gameEvents.on("round_end", (evt) => {
      if (!match_status.started) {
        lo3.onRoundEnd({ match_status });

        return;
      }

      round_data.winner = demoFile.teams[evt.winner].clanName;
      round_data.round_end_time = demoFile.currentTime;

      demo_info.rounds.push(round_data); // save round

      round_data = newRound(demoFile);
    });

    demoFile.gameEvents.on("round_officially_ended", () => {
      if (!match_status.started) {
        return;
      }

      round_data.round_end_time = demoFile.currentTime;
      demo_info.rounds_end.push(round_data); // save data after round ends
    });

    demoFile.gameEvents.on("player_death", (evt) => {
      if (!match_status.started) {
        return;
      }

      onPlayerDeath({ demoFile, round_data }, evt);
      playerEntryKill.onPlayerDeath({ demoFile, round_data, tmp_round }, evt);
    });

    demoFile.gameEvents.on("bomb_defused", (evt) => {
      if (!match_status.started) {
        return;
      }

      playerDoObjective({ demoFile, round_data }, evt);
    });

    demoFile.gameEvents.on("bomb_planted", (evt) => {
      if (!match_status.started) {
        return;
      }
      playerDoObjective({ demoFile, round_data }, evt);
    });

    demoFile.on("start", () => {
      console.log(`[${process.pid}] start buffer`);

      demo_info.map = demoFile.header.mapName;
    });

    demoFile.on("end", () => {
      console.log(`[${process.pid}] DEMO SAVING`);

      fs.writeFile(data_file_path, JSON.stringify(demo_info), "utf8", () => {
        console.log(`[${process.pid}] DEMO DONE`);

        delete demo_info.rounds;
        delete demo_info.rounds_end;

        callback(demo_info);
      });
    });

    demoFile.parse(buffer);
  });
};
