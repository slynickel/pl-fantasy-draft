export interface LeagueEntry {
  entry_id: number;
  entry_name: string;
  id: number;
  joined_time: string;
  player_first_name: string;
  player_last_name: string;
  short_name: string;
  waiver_pick: number;
  event_total?: number;
  points?: number;
  rank?: number;
}

export interface LeagueDetails {
  league: {
    id: number;
    name: string;
    admin_entry: number;
    scoring: string;
    start_event: number;
    stop_event: number;
    drafts: Array<{
      id: number;
      draft_completed: string;
      event: number;
    }>;
  };
  league_entries: LeagueEntry[];
}

export interface EntryEvent {
  entry: number;
  event: number;
  points: number;
  total_points: number;
  rank: number;
  rank_sort: number;
  overall_rank: number;
  bank: number;
  value: number;
  event_transfers: number;
  event_transfers_cost: number;
  points_on_bench: number;
}

export interface DashboardData {
  league: LeagueDetails['league'];
  standings: (LeagueEntry & { event_total: number; overall_points: number })[];
  last_updated: string;
}
