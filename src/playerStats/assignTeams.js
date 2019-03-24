module.exports = ({ demoFile, demo_info, match_status }) => {
  if (
    Object.keys(demo_info.team1_players).length === 5 &&
    Object.keys(demo_info.team2_players).length === 5
  ) {
    match_status.got_players = true;

    return;
  }

  if (!demo_info.team1_name) {
    demo_info.team1_name = demoFile.entities.teams[2].clanName;
  }

  if (!demo_info.team2_name) {
    demo_info.team2_name = demoFile.entities.teams[3].clanName;
  }

  demoFile.entities.players.map((player) => {
    if (!player.team) {
      return;
    }

    const player_team = player.team.clanName;
    const player_steam = player.steam64Id;

    if (demo_info.team1_name === player_team && !demo_info.team1_players[player_steam]) {
      demo_info.team1_players[player_steam] = player.name;
    }

    if (demo_info.team2_name === player_team && !demo_info.team2_players[player_steam]) {
      demo_info.team2_players[player_steam] = player.name;
    }
  });
};
