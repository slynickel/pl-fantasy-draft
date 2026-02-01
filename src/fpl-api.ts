import type { LeagueDetails, DashboardData, LeagueEntry, EventInfo } from './types';

const FPL_BASE_URL = 'https://draft.premierleague.com/api';
const FPL_PUBLIC_API = 'https://fantasy.premierleague.com/api';

export class FPLClient {
  async getLeagueDetails(leagueId: number): Promise<LeagueDetails> {
    const response = await fetch(`${FPL_BASE_URL}/league/${leagueId}/details`);
    if (!response.ok) {
      throw new Error(`Failed to fetch league details: ${response.statusText}`);
    }
    return response.json() as Promise<LeagueDetails>;
  }

  async getEventsInfo(): Promise<EventInfo[]> {
    try {
      const response = await fetch(`${FPL_PUBLIC_API}/bootstrap-static/`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json() as any;
      return (data.events || []).map((e: any) => ({
        id: e.id,
        name: e.name,
        deadline_time: e.deadline_time,
        deadline_time_epoch: e.deadline_time_epoch,
        finished: e.finished,
      }));
    } catch (err) {
      console.warn('Could not fetch events info:', err);
      return [];
    }
  }

  async getDashboardData(leagueId: number): Promise<DashboardData> {
    const league = await this.getLeagueDetails(leagueId);
    const eventsInfo = await this.getEventsInfo();
    const eventMap = new Map(eventsInfo.map(e => [e.id, e]));
    
    // Extract standings from the league response
    const standingsData = league.standings || [];
    const entriesMap = new Map(league.league_entries.map(e => [e.id, e]));
    
    // Convert standings to the format we need
    const standings: Array<LeagueEntry & { event_total: number; overall_points: number, tableTotal: number}> = [];
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
          matches_lost: standing.matches_lost,
          tableTotal: standing.total
        });
      }
    });
    
    // Sort by rank
    standings.sort((a, b) => (a.rank || 0) - (b.rank || 0));

    // Determine current event and neighboring matches: prefer any ongoing event, otherwise use the latest event
    const allMatches: any[] = (league as any).matches || [];
    let currentEvent: number | null = null;
    if (allMatches.length > 0) {
      const ongoing = allMatches.find(m => m.started && !m.finished);
      if (ongoing) {
        currentEvent = ongoing.event;
      } else {
        currentEvent = Math.max(...allMatches.map(m => m.event));
      }
    }

    const events = Array.from(new Set(allMatches.map(m => m.event))).sort((a, b) => a - b);
    const currentIndex = currentEvent ? events.indexOf(currentEvent) : -1;
    const prevEvent = currentIndex > 0 ? events[currentIndex - 1] : null;
    const nextEvent = (currentIndex >= 0 && currentIndex < events.length - 1) ? events[currentIndex + 1] : null;

    const currentMatches = currentEvent ? allMatches.filter(m => m.event === currentEvent).map(m => ({ ...m, eventInfo: eventMap.get(currentEvent!) })) : [];
    const prevMatches = prevEvent ? allMatches.filter(m => m.event === prevEvent).map(m => ({ ...m, eventInfo: eventMap.get(prevEvent!) })) : [];
    const nextMatches = nextEvent ? allMatches.filter(m => m.event === nextEvent).map(m => ({ ...m, eventInfo: eventMap.get(nextEvent!) })) : [];

    return {
      league: league.league,
      standings,
      matches: {
        prev: prevMatches,
        current: currentMatches,
        next: nextMatches,
      },
      last_updated: new Date().toISOString(),
    };
  }
}
