import WorkerFarm from "worker-farm";
import * as fs from "fs";
import { DemoMeta } from "./utils/DemoMeta";
import { DemoResult } from "./utils/DemoResult";

const workers = WorkerFarm(require.resolve("./Reader.ts"));

const root_path = `${__dirname}/../`;
const demo_folder = "demos/";
const data_folder = "match_datas";

const files = fs.readdirSync(root_path + demo_folder);
const files_length = files.length;

let i = 0;

fs.mkdir(root_path + data_folder, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});

const demo_list: Array<DemoResult> = [];

files.map(function(filename: string) {
  const without_ext = filename
    .split(".")
    .slice(0, -1)
    .join(".");

  const demo_file_path = root_path + demo_folder + filename;
  const data_file_path = root_path + data_folder + without_ext + ".json";

  const demo_meta: DemoMeta = {
    root_path,
    demo_file: without_ext,
    demo_folder: demo_folder,
    data_folder: data_folder
  };

  workers(demo_meta, function(sneak_peek: DemoResult): void {
    i++;

    console.log(
      `PROGRESS: ${i}/${files_length} [${((i * 100.0) / files_length).toFixed(
        2
      )} %]`
    );

    // demo_list.push({
    //   data_file: `${without_ext}.json`,
    //   ...sneak_peek
    // });

    demo_list.push(sneak_peek);

    if (i == files_length) {
      const demos_list = root_path + data_folder + "list.json";

      console.log(`\n\nEND DEMOS\n\nwriting to ${demos_list}`);

      fs.writeFile(demos_list, JSON.stringify(demo_list), "utf8", () =>
        console.log("\n\nfinished writing")
      );

      WorkerFarm.end(workers);
    }
  });
});
