export interface DemoResult {
  date: string;
  map: string;
  team1_name: string;
  team2_name: string;
  team1_players: Array<Player>;
  team2_players: Array<Player>;
  rounds: Array<Round>;
  rounds_end: Array<RoundEnd>;
  data_file: string;
}
