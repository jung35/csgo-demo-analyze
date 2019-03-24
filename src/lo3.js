const lo3 = (demoFile, match_status) => {
  const on_round_start = () => {
    if (++match_status.count === 3) {
      console.log(`[${process.pid}] match start`);
      match_status.started = true;
      demoFile.gameEvents.removeListener("round_end", on_round_end);
      demoFile.gameEvents.removeListener("round_start", on_round_start);
    }
  };

  const on_round_end = () => {
    match_status.count = 0;
  };

  demoFile.gameEvents.on("round_start", on_round_start);

  demoFile.gameEvents.on("round_end", on_round_end);
};

module.exports = lo3;
