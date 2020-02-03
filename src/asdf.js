const workerFarm = require("worker-farm");
const workers = workerFarm(require.resolve("./reader.js"));

const fs = require("fs");

const root_path = `${__dirname}/../`;
const demo_folder = "demos/";
const data_folder = "match_datas/";

const files = fs.readdirSync(root_path + demo_folder);
const files_length = files.length;

let i = 0;

fs.mkdir(root_path + data_folder, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});

const demo_list = [];

files.map((filename) => {
  const without_ext = filename
    .split(".")
    .slice(0, -1)
    .join(".");

  const demo_file_path = root_path + demo_folder + filename;
  const data_file_path = root_path + data_folder + without_ext + ".json";

  workers({ demo_file_path, data_file_path }, function (sneak_peek) {
    i++;

    console.log(`PROGRESS: ${i}/${files_length} [${((i * 100.0) / files_length).toFixed(2)} %]`);

    demo_list.push({
      data_file: without_ext + ".json",
      ...sneak_peek,
    });

    if (i == files_length) {
      const demos_list = root_path + data_folder + "list.json";

      console.log(`\n\nEND DEMOS\n\nwriting to ${demos_list}`);

      fs.writeFile(demos_list, JSON.stringify(demo_list), "utf8", () =>
        console.log("\n\nfinished writing")
      );

      workerFarm.end(workers);
    }
  });
});
