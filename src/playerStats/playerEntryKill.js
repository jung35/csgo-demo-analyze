module.exports = {
  onPlayerDeath: ({ demoFile, round_data, tmp_round }, evt) => {
    const { attacker, weapon } = evt;

    if (tmp_round.entry_kill || weapon === "world" || weapon === "worldspawn") {
      return;
    }

    tmp_round.entry_kill = true;

    const killer = demoFile.entities.getByUserId(attacker);
    const killer_steam64Id = killer.steam64Id;

    round_data.players[killer_steam64Id].entry = true;
    round_data.players[killer_steam64Id].entry_weapon = weapon;
  },
};
