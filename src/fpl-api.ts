import type { LeagueDetails, EntryEvent, DashboardData } from './types';

const FPL_BASE_URL = 'https://draft.premierleague.com/api';

export class FPLClient {
  async getLeagueDetails(leagueId: number): Promise<LeagueDetails> {
    const response = await fetch(`${FPL_BASE_URL}/league/${leagueId}/details`);
    if (!response.ok) {
      throw new Error(`Failed to fetch league details: ${response.statusText}`);
    }
    return response.json();
  }

  async getEntryEvent(entryId: number, eventId: number): Promise<EntryEvent> {
    const response = await fetch(`${FPL_BASE_URL}/entry/${entryId}/event/${eventId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch entry event: ${response.statusText}`);
    }
    return response.json();
  }

  async getDashboardData(leagueId: number): Promise<DashboardData> {
    const league = await this.getLeagueDetails(leagueId);
    
    // Get current event (or last completed event for draft leagues)
    const currentEvent = league.league.start_event;
    
    // Fetch points for each league entry
    const standingsPromises = league.league_entries.map(async (entry) => {
      try {
        const eventData = await this.getEntryEvent(entry.entry_id, currentEvent);
        return {
          ...entry,
          event_total: eventData.points,
          overall_points: eventData.total_points,
          rank: eventData.overall_rank,
        };
      } catch (error) {
        // If we can't fetch individual entry data, return with 0 points
        return {
          ...entry,
          event_total: 0,
          overall_points: 0,
          rank: 0,
        };
      }
    });

    const standings = await Promise.all(standingsPromises);
    
    // Sort by overall points (descending)
    standings.sort((a, b) => b.overall_points - a.overall_points);

    return {
      league: league.league,
      standings,
      last_updated: new Date().toISOString(),
    };
  }
}
