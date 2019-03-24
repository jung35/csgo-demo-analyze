const workerFarm = require("worker-farm");
const workers = workerFarm(require.resolve("./reader.js"));

const fs = require("fs");

const stats = {};

const root_path = `${__dirname}/../`;
const folder = "demos/";

const files = fs.readdirSync(root_path + folder);
const files_length = files.length;

let i = 0;

files.map((filename) => {
  workers(root_path + folder + filename, function(err, local_stats) {
    if (err) {
      i++;
      console.log("error", err);

      return;
    }

    Object.keys(local_stats).map((player) => {
      if (!stats[player]) {
        stats[player] = {};
      }

      Object.keys(local_stats[player]).map((player_stats) => {
        if (!stats[player][player_stats]) {
          stats[player][player_stats] = 0;
        }

        stats[player][player_stats] += local_stats[player][player_stats];
      });
    });

    i++;

    console.log(`PROGRESS: ${i}/${files_length} [${((i * 100.0) / files_length).toFixed(2)} %]`);

    if (i == files_length) {
      console.log("\n\nEND DEMOS\n\nwriting to ./demo_stats.json");

      fs.writeFile(`${root_path}/demo_stats.json`, JSON.stringify(stats), "utf8", () =>
        console.log("\n\nfinished writing")
      );
      workerFarm.end(workers);
    }
  });
});
