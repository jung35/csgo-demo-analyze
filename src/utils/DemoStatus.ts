import * as MatchNotStartedError from "../errors/MatchNotStartedError";

export class DemoStatus {
  private match_started = false;
  private round_count = 0;
  private got_players = false;

  onRoundStart(): boolean {
    if (++this.round_count === 3) {
      console.log(`[${process.pid}] match start`);
      this.match_started = true;
    }

    return this.demoMatchStarted();
  }

  onRoundEnd(): void {
    if (!this.demoMatchStarted()) {
      // reset round counter to 0 if round hasnt started yet
      this.round_count = 0;

      throw new MatchNotStartedError.MatchNotStartedError();
    }
  }

  demoMatchStarted(): boolean {
    return this.match_started;
  }

  hasPlayers(): boolean {
    return Boolean(this.got_players);
  }
}
