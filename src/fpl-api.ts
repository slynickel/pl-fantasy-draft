import type { LeagueDetails, EntryEvent, DashboardData, LeagueEntry } from './types';

const FPL_BASE_URL = 'https://draft.premierleague.com/api';

export class FPLClient {
  async getLeagueDetails(leagueId: number): Promise<LeagueDetails> {
    const response = await fetch(`${FPL_BASE_URL}/league/${leagueId}/details`);
    if (!response.ok) {
      throw new Error(`Failed to fetch league details: ${response.statusText}`);
    }
    return response.json() as Promise<LeagueDetails>;
  }

  async getDashboardData(leagueId: number): Promise<DashboardData> {
    const league = await this.getLeagueDetails(leagueId);
    
    // Extract standings from the league response
    const standingsData = league.standings || [];
    const entriesMap = new Map(league.league_entries.map(e => [e.id, e]));
    
    // Convert standings to the format we need
    const standings: Array<LeagueEntry & { event_total: number; overall_points: number }> = [];
    standingsData.forEach((standing: any) => {
      const entry = entriesMap.get(standing.league_entry);
      if (entry) {
        standings.push({
          entry_id: entry.entry_id,
          entry_name: entry.entry_name,
          id: entry.id,
          joined_time: entry.joined_time,
          player_first_name: entry.player_first_name,
          player_last_name: entry.player_last_name,
          short_name: entry.short_name,
          waiver_pick: entry.waiver_pick,
          event_total: 0,
          overall_points: standing.points_for,
          rank: standing.rank,
          matches_played: standing.matches_played,
          matches_won: standing.matches_won,
        });
      }
    });
    
    // Sort by rank
    standings.sort((a, b) => (a.rank || 0) - (b.rank || 0));

    return {
      league: league.league,
      standings,
      last_updated: new Date().toISOString(),
    };
  }
}
