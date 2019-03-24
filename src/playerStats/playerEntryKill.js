module.exports = {
  onPlayerDeath: ({ demoFile, round_data, tmp_round }, evt) => {
    const { userid, attacker, weapon } = evt;

    if (tmp_round.entry_kill || weapon === "world" || weapon === "worldspawn") {
      return;
    }

    tmp_round.entry_kill = true;

    const killer = demoFile.entities.getByUserId(attacker);
    const victim = demoFile.entities.getByUserId(userid);

    const victim_steam64Id = victim.steam64Id;
    const killer_steam64Id = killer.steam64Id;

    if (!killer.isFakePlayer) {
      round_data.players[killer_steam64Id].entry = true;
      round_data.players[killer_steam64Id].entry_weapon = weapon;
      round_data.players[killer_steam64Id].entry_time = demoFile.currentTime;
    }

    if (!victim.isFakePlayer) {
      round_data.players[victim_steam64Id].first_blood = true;
      round_data.players[victim_steam64Id].first_blood_time = demoFile.currentTime;
    }
  },
};
