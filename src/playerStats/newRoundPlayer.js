module.exports = () => ({
  kills: 0,
  headshots: 0,
  assists: 0,
  time_alive: -1, // -1 == alive

  damage: 0,

  objective: false,

  entry: false,
  entry_time: null,
  entry_weapon: null,

  first_blood: false,
  first_blood_time: null,

  "1v1": false,
  "1v2": false,
  "1v3": false,
  "1v4": false,
  "1v5": false,
});
