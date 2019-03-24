const initStats = () => ({
  rounds: 0,
  rounds_ct: 0,
  rounds_t: 0,

  temp_kills: 0,

  kills: 0,
  headshots: 0,
  assists: 0,
  deaths: 0,

  "2k": 0,
  "3k": 0,
  "4k": 0,
  "5k": 0,

  damage: 0,
  // self_harm: 0,

  time_alive: 0,

  bombs_planted: 0,
  bombs_defused: 0,

  enemies_flashed: 0,
  enemies_flashed_duration: 0,
  teammates_flashed: 0,
  teammates_flashed_duration: 0,

  flashed_by_enemies: 0,
  flashed_by_enemies_duration: 0,
  flashed_by_teammates: 0,
  flashed_by_teammates_duration: 0,
});

module.exports = initStats;
