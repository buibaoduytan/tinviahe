export interface TeamStanding {
  id: number;
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  logoUrl?: string;
}

export interface SeasonData {
  season: string; 
  standings: TeamStanding[];
}

export interface LeagueData {
  id: string; 
  name: string; 
  shortName: string;
  country: string;
  badgeText: string;
  themeColor: string; 
  seasons: SeasonData[];
}

export interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
}

export interface NextOpponent {
  name: string;
  logo: string;
}

export interface StandingItem {
  id: number;
  position: number;
  prevPosition: number;
  teamName: string;
  shortName: string;
  logoUrl: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
  nextOpponent: NextOpponent;
  homeStats: TeamStats;
  awayStats: TeamStats;
  topScorer: string;
  cleanSheets: number;
}

export interface LeaderboardProps {
  standingsData?: StandingItem[];
  season?: string;
}