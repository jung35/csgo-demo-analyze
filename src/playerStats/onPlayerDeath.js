const newRoundPlayer = require("./newRoundPlayer");

module.exports = ({ demoFile, round_data }, evt) => {
  const { userid, attacker, assister, weapon, headshot } = evt;

  if (weapon === "world" || weapon === "worldspawn") {
    return;
  }

  // console.log("evt", evt);

  const killer = demoFile.entities.getByUserId(attacker);
  const dead = demoFile.entities.getByUserId(userid);
  const assist = assister ? demoFile.entities.getByUserId(assister) : {};

  if (!killer) {
    console.log("\n\n\n|", attacker, "|", weapon, "|\n\n\n");
  }

  // record kills
  const killer_steam64Id = killer.steam64Id;

  if (!round_data.players[killer_steam64Id]) {
    round_data.players[killer_steam64Id] = newRoundPlayer();
  }

  if (!round_data.players[killer_steam64Id][`wp_${weapon}`]) {
    round_data.players[killer_steam64Id][`wp_${weapon}`] = 0;
    round_data.players[killer_steam64Id][`wp_${weapon}_hs`] = 0;
  }

  round_data.players[killer_steam64Id].kills++;
  round_data.players[killer_steam64Id][`wp_${weapon}`]++;

  if (headshot) {
    round_data.players[killer_steam64Id].headshots++;
    round_data.players[killer_steam64Id][`wp_${weapon}_hs`]++;
  }

  if (assist) {
    // record assist
    const assist_steam64Id = assist.steam64Id;

    if (!round_data.players[assist_steam64Id]) {
      round_data.players[assist_steam64Id] = newRoundPlayer();
    }

    round_data.players[assist_steam64Id].assists++;
  }

  //record deaths
  const dead_steam64Id = dead.steam64Id;

  if (!round_data.players[dead_steam64Id]) {
    round_data.players[dead_steam64Id] = newRoundPlayer();
  }

  round_data.players[dead_steam64Id].time_alive =
    demoFile.currentTime - round_data.round_start_time;
};
