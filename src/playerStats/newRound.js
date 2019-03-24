module.exports = (demoFile) => ({
  round_start_time: demoFile.currentTime,
  round_end_time: 0,
  t: demoFile.teams[2].clanName,
  ct: demoFile.teams[3].clanName,
  winner: null,
  players: {},
});
