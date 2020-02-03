import * as fs from "fs";
import * as DemoFile from "demofile";
import { DemoMeta, getDemoPath } from "./utils/DemoMeta";
import { DemoResult } from "./utils/DemoResult";
import * as DemoStatus from "./utils/DemoStatus";

export default function Reader(
  demo_meta: DemoMeta,
  callback: (func: DemoResult) => void
): void {
  const demo_file_path = getDemoPath(demo_meta);
  console.log(`[${process.pid}] STARTING:`, demo_file_path);

  fs.readFile(demo_file_path, function(err, buffer: Buffer): void {
    const demo_status = new DemoStatus.DemoStatus();

    const sneak_peek: DemoResult = {
      data_file: `${demo_meta.demo_file}.json`
    };

    // new data every new round
    let round_data = null;

    // garbage data to be stored and refreshed each round
    let tmp_round = {};

    const demo_file = new DemoFile.DemoFile();

    demo_file.gameEvents.on("round_start", () => {
      tmp_round = {};

      if (!demo_status.demoMatchStarted()) {
        // check to see if lo3 happened
        if (!demo_status.onRoundStart()) {
          return;
        }
      }

      if (!demo_status.hasPlayers()) {
        assignTeams({
          demo_file,
          match_status,
          demo_info
        });
      }

      round_data = newRound(demo_file);
    });

    demo_file.gameEvents.on("round_end", (evt) => {
      try {
        demo_status.onRoundEnd();
      } catch (error) {
        return;
      }

      round_data.winner = demo_file.teams[evt.winner].clanName;
      round_data.round_end_time = demo_file.currentTime;
      onRoundEnd({
        demo_file,
        round_data,
        demo_info
      });

      demo_info.rounds.push(round_data); // save round

      round_data = newRound(demo_file);
    });

    demo_file.gameEvents.on("round_officially_ended", () => {
      if (!match_status.started) {
        return;
      }

      round_data.round_end_time = demo_file.currentTime;
      onRoundEnd({
        demo_file,
        round_data,
        demo_info
      });

      demo_info.rounds_end.push(round_data); // save data after round ends
    });

    demo_file.gameEvents.on("player_death", (evt) => {
      if (!match_status.started) {
        return;
      }

      onPlayerDeath(
        {
          demo_file,
          round_data
        },
        evt
      );
      playerEntryKill.onPlayerDeath(
        {
          demo_file,
          round_data,
          tmp_round
        },
        evt
      );
      playerClutchRound.onPlayerDeath(
        {
          demo_file,
          round_data,
          tmp_round
        },
        evt
      );
    });

    demo_file.gameEvents.on("bomb_defused", (evt) => {
      if (!match_status.started) {
        return;
      }

      playerDoObjective(
        {
          demo_file,
          round_data
        },
        evt
      );
    });

    demo_file.gameEvents.on("bomb_planted", (evt) => {
      if (!match_status.started) {
        return;
      }
      playerDoObjective(
        {
          demo_file,
          round_data
        },
        evt
      );
    });

    demo_file.on("start", () => {
      console.log(`[${process.pid}] start buffer`);

      demo_info.map = demo_file.header.mapName;
    });

    demo_file.on("end", () => {
      console.log(`[${process.pid}] DEMO SAVING`);

      fs.writeFile(data_file_path, JSON.stringify(demo_info), "utf8", () => {
        console.log(`[${process.pid}] DEMO DONE`);

        delete demo_info.rounds;
        delete demo_info.rounds_end;

        callback(demo_info);
      });
    });

    demo_file.parse(buffer);
  });
}
