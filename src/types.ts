// LeagueEntry is a combo of standings and league_entries
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
  overall_points?: number;
  rank?: number;
  matches_played?: number;
  matches_won?: number;
  matches_lost?: number;
  matches_drawn?: number;
}

// Standing is https://draft.premierleague.com/api/league/:LEAGUE_ID/details
// .standings[]
export interface Standing {
  last_rank: number;
  league_entry: number;
  matches_drawn: number;
  matches_lost: number;
  matches_played: number;
  matches_won: number;
  points_against: number;
  points_for: number;
  rank: number;
  rank_sort: number;
  total: number;
}

// LeagueDetails is https://draft.premierleague.com/api/league/:LEAGUE_ID/details
// .matches[]
export interface LeagueMatch {
  event: number;
  finished: boolean;
  league_entry_1: number;
  league_entry_1_points?: number | null;
  league_entry_2: number;
  league_entry_2_points?: number | null;
  started: boolean;
  winning_league_entry?: number | null;
  winning_method?: string | null;
}

// LeagueDetails is https://draft.premierleague.com/api/league/:LEAGUE_ID/details
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
  matches: LeagueMatch[];
  standings: Standing[];
}


export interface EventInfo {
  id: number;
  name: string;
  deadline_time: string;
  deadline_time_epoch: number;
  finished: boolean;
}

export interface DashboardData {
  league: LeagueDetails['league'];
  standings: (LeagueEntry & { event_total: number; overall_points: number; tableTotal: number; })[];
  matches?: {
    prev?: (LeagueMatch & { eventInfo?: EventInfo })[];
    current?: (LeagueMatch & { eventInfo?: EventInfo })[];
    next?: (LeagueMatch & { eventInfo?: EventInfo })[];
  };
  last_updated: string;
}
