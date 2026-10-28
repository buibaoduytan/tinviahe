export interface SplitStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
}

export interface Club {
  id: number;
  position: number;
  prevPosition?: number;
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
  nextOpponent?: { name: string; logo?: string };
  homeStats: SplitStats;
  awayStats: SplitStats;
  topScorer?: string;
  cleanSheets?: number;
}

export interface League {
  id: string;
  name: string;
  season: string;
  href: string;
  zones: { ucl: number; uel: number; relegationFrom: number; relegationLabel: string };
  clubs: Club[];
}

type Split = [number, number, number, number, number, number];

interface Extra {
  logoUrl?: string; // ghi đè logo nếu cần
  form?: string;
  next?: string;
  nextLogo?: string; // ghi đè logo đối thủ nếu cần
  prevPosition?: number;
  topScorer?: string;
  cleanSheets?: number;
}

// ==================== LOGO (một nguồn thống nhất cho cả 5 giải) ====================
// Nguồn: https://github.com/luukhopman/football-logos (PNG 139x181)

const LOGO_BASE = "/logos";

const buildLogos = (folder: string, files: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(files).map(([name, file]) => [
      name,
      `${LOGO_BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(file)}.png`,
    ])
  );

const toSplit = ([played, won, drawn, lost, gf, ga]: Split): SplitStats => ({
  played,
  won,
  drawn,
  lost,
  gf,
  ga,
  pts: won * 3 + drawn,
});

const   makeClub =
  (base: number, logos: Record<string, string>) =>
  (
    position: number,
    teamName: string,
    shortName: string,
    overall: Split,
    home: Split,
    away: Split,
    extra: Extra = {}
  ): Club => {
    const [played, won, drawn, lost, goalsFor, goalsAgainst] = overall;
    return {
      id: base + position,
      position,
      prevPosition: extra.prevPosition,
      teamName,
      shortName,
      logoUrl: extra.logoUrl ?? logos[teamName] ?? "",
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: won * 3 + drawn,
      form: extra.form ? extra.form.split("") : [],
      nextOpponent: extra.next
        ? { name: extra.next, logo: extra.nextLogo ?? logos[extra.next] }
        : undefined,
      homeStats: toSplit(home),
      awayStats: toSplit(away),
      topScorer: extra.topScorer,
      cleanSheets: extra.cleanSheets,
    };
  };

// ==================== 1. PREMIER LEAGUE ====================
const PL_LOGOS = buildLogos("England - Premier League", {
  "Manchester City": "Manchester City",
  "Arsenal": "Arsenal FC",
  "Brighton": "Brighton & Hove Albion",
  "Brentford": "Brentford FC",
  "Leeds United": "Leeds United",
  "Liverpool": "Liverpool FC",
  "Everton": "Everton FC",
  "Hull City": "Hull City",
  "Newcastle United": "Newcastle United",
  "Chelsea": "Chelsea FC",
  "Ipswich Town": "Ipswich Town",
  "Manchester United": "Manchester United",
  "Nottingham Forest": "Nottingham Forest",
  "Sunderland": "Sunderland AFC",
  "Crystal Palace": "Crystal Palace",
  "Aston Villa": "Aston Villa",
  "Bournemouth": "AFC Bournemouth",
  "Coventry City": "Coventry City",
  "Fulham": "Fulham FC",
  "Tottenham Hotspur": "Tottenham Hotspur",
});


const pl = makeClub(100, PL_LOGOS);
export const PREMIER_LEAGUE_CLUBS: Club[] = [
  pl(1, "Manchester City", "MCI", [5, 5, 0, 0, 13, 5], [3, 3, 0, 0, 8, 4], [2, 2, 0, 0, 5, 1], { form: "WWWWW", next: "Liverpool", prevPosition: 1, topScorer: "E. Haaland (7)", cleanSheets: 3 }),
  pl(2, "Arsenal", "ARS", [5, 4, 0, 1, 8, 4], [2, 2, 0, 0, 5, 1], [3, 2, 0, 1, 3, 3], { form: "WWWWL", next: "Leeds United",prevPosition: 3, topScorer: "B. Saka (4)", cleanSheets: 2 }),
  pl(3, "Brighton & Hove Albion", "BHA", [5, 3, 1, 1, 16, 5], [3, 2, 1, 0, 8, 1], [2, 1, 0, 1, 8, 4], { form: "WLDWW", next: "Sunderland",prevPosition: 2, topScorer: "J. Pedro (5)", cleanSheets: 2 }),
  pl(4, "Brentford", "BRE", [5, 2, 3, 0, 10, 4], [3, 2, 1, 0, 7, 1], [2, 0, 2, 0, 3, 3], { form: "WDDDW", next: "Aston Villa",prevPosition: 5, topScorer: "B. Mbeumo (3)", cleanSheets: 2 }),
  pl(5, "Leeds United", "LEE", [5, 2, 3, 0, 7, 3], [3, 1, 2, 0, 5, 2], [2, 1, 1, 0, 2, 1], { form: "WDDWD", next: "Arsenal",prevPosition: 4, topScorer: "L. Nmecha (2)", cleanSheets: 3 }),
  pl(6, "Liverpool", "LIV", [5, 2, 3, 0, 7, 4], [2, 0, 2, 0, 2, 2], [3, 2, 1, 0, 5, 2], { form: "DDWDW", next: "Manchester City",prevPosition: 6, topScorer: "M. Salah (3)", cleanSheets: 2 }),
  pl(7, "Everton", "EVE", [5, 2, 3, 0, 6, 3], [3, 2, 1, 0, 5, 2], [2, 0, 2, 0, 1, 1], { form: "WDDDW", next: "Hull City",prevPosition: 9, topScorer: "D. Calvert-Lewin (2)", cleanSheets: 3 }),
  pl(8, "Hull City", "HUL", [5, 2, 2, 1, 6, 4], [2, 1, 1, 0, 2, 0], [3, 1, 1, 1, 4, 4], { form: "WWDDL", next: "Everton",prevPosition: 7, topScorer: "O. McBurnie (2)", cleanSheets: 2 }),
  pl(9, "Newcastle United", "NEW", [5, 2, 2, 1, 9, 9], [3, 1, 2, 0, 6, 5], [2, 1, 0, 1, 3, 4], { form: "DWDLW", next: "Coventry City",prevPosition: 8, topScorer: "A. Isak (3)", cleanSheets: 1 }),
  pl(10, "Chelsea", "CHE", [5, 2, 1, 2, 10, 12], [2, 1, 1, 0, 6, 5], [3, 1, 0, 2, 4, 7], { form: "WWLDL", next: "Bournemouth",prevPosition: 11, topScorer: "C. Palmer (4)", cleanSheets: 1 }),
  pl(11, "Ipswich Town", "IPS", [5, 2, 0, 3, 7, 11], [2, 1, 0, 1, 2, 3], [3, 1, 0, 2, 5, 8], { form: "WLLWL", next: "Fulham",prevPosition: 10, topScorer: "L. Delap (2)", cleanSheets: 1 }),
  pl(12, "Manchester United", "MUN", [5, 1, 2, 2, 8, 8], [2, 1, 0, 1, 5, 3], [3, 0, 2, 1, 3, 5], { form: "LWDLD", next: "Tottenham Hotspur",prevPosition: 14, topScorer: "B. Fernandes (2)", cleanSheets: 1 }),
  pl(13, "Nottingham Forest", "NFO", [5, 1, 2, 2, 4, 5], [3, 0, 1, 2, 0, 2], [2, 1, 1, 0, 4, 3], { form: "LDDWL", next: "Crystal Palace",prevPosition: 12, topScorer: "C. Wood (2)", cleanSheets: 1 }),
  pl(14, "Sunderland", "SUN", [5, 1, 1, 3, 6, 10], [2, 1, 0, 1, 1, 2], [3, 0, 1, 2, 5, 8], { form: "LWDLL", next: "Brighton & Hove Albion",prevPosition: 13, topScorer: "J. Bellingham (2)", cleanSheets: 1 }),
  pl(15, "Crystal Palace", "CRY", [5, 1, 1, 3, 6, 11], [2, 0, 0, 2, 3, 7], [3, 1, 1, 1, 3, 4], { form: "LLWLD", next: "Nottingham Forest",prevPosition: 16, topScorer: "J. Mateta (2)", cleanSheets: 0 }),
  pl(16, "Aston Villa", "AVL", [5, 1, 1, 3, 4, 9], [2, 0, 0, 2, 1, 3], [3, 1, 1, 1, 3, 6], { form: "LLDLW", next: "Brentford",prevPosition: 15, topScorer: "O. Watkins (2)", cleanSheets: 1 }),
  pl(17, "Bournemouth", "BOU", [5, 0, 3, 2, 6, 8], [3, 0, 2, 1, 3, 4], [2, 0, 1, 1, 3, 4], { form: "LDDDL", next: "Chelsea",prevPosition: 17, topScorer: "A. Semenyo (2)", cleanSheets: 0 }),
  pl(18, "Coventry City", "COV", [5, 1, 0, 4, 1, 10], [2, 0, 0, 2, 0, 6], [3, 1, 0, 2, 1, 4], { form: "LLLLW", next: "Newcastle United",prevPosition: 19, topScorer: "H. Wright (1)", cleanSheets: 1 }),
  pl(19, "Fulham", "FUL", [5, 0, 2, 3, 5, 8], [3, 0, 1, 2, 5, 7], [2, 0, 1, 1, 0, 1], { form: "LLLDD", next: "Ipswich Town",prevPosition: 18, topScorer: "R. Jiménez (2)", cleanSheets: 0 }),
  pl(20, "Tottenham Hotspur", "TOT", [5, 0, 2, 3, 2, 8], [3, 0, 1, 2, 2, 5], [2, 0, 1, 1, 0, 3], { form: "LLDDL", next: "Manchester United",prevPosition: 20, topScorer: "H. Son (1)", cleanSheets: 0 }),
];

export const PREMIER_LEAGUE: League = {
  id: "pl",
  name: "Premier League",
  season: "2025-2026",
  href: "/leagues/premier-league",
  zones: { ucl: 4, uel: 6, relegationFrom: 18, relegationLabel: "Xuống hạng Championship" },
  clubs: PREMIER_LEAGUE_CLUBS,
};

// ==================== 2. LA LIGA ====================
const LL_LOGOS = buildLogos("Spain - LaLiga", {
  "Barcelona": "FC Barcelona",
  "Atlético Madrid": "Atlético de Madrid",
  "Real Betis": "Real Betis Balompié",
  "Real Madrid": "Real Madrid",
  "Sevilla": "Sevilla FC",
  "Alavés": "Deportivo Alavés",
  "Deportivo Alavés": "Deportivo Alavés", // tên dùng ở `next`
  "Deportivo La Coruña": "Deportivo A Coruña",
  "Real Sociedad": "Real Sociedad",
  "Villarreal": "Villarreal CF",
  "Athletic Bilbao": "Athletic Bilbao",
  "Getafe": "Getafe CF",
  "Rayo Vallecano": "Rayo Vallecano",
  "Osasuna": "CA Osasuna",
  "Atlético Osasuna": "CA Osasuna", // tên dùng ở `next`
  "Celta Vigo": "Celta de Vigo",
  "Espanyol": "RCD Espanyol Barcelona",
  "Racing de Santander": "Racing Santander",
  "Levante": "Levante UD",
  "Elche": "Elche CF",
  "Valencia": "Valencia CF",
  "Málaga": "Málaga CF",
});

const ll = makeClub(200, LL_LOGOS);
export const LA_LIGA_CLUBS: Club[] = [
  ll(1, "Barcelona", "BAR", [7, 7, 0, 0, 31, 7], [3, 3, 0, 0, 14, 4], [4, 4, 0, 0, 17, 3], { form: "WWWWW", next: "Getafe", prevPosition: 1, topScorer: "R. Lewandowski (8)", cleanSheets: 3 }),
  ll(2, "Atlético Madrid", "ATM", [7, 5, 1, 1, 16, 7], [4, 3, 1, 0, 10, 3], [3, 2, 0, 1, 6, 4], { form: "WLWWW", next: "Deportivo Alavés", prevPosition: 2, topScorer: "A. Griezmann (4)", cleanSheets: 3 }),
  ll(3, "Real Betis", "BET", [7, 5, 1, 1, 9, 7], [3, 3, 0, 0, 3, 0], [4, 2, 1, 1, 6, 7], { form: "LWWWD", next: "Atlético Osasuna", prevPosition: 4, topScorer: "V. Roque (3)", cleanSheets: 4 }),
  ll(4, "Real Madrid", "RMA", [7, 5, 0, 2, 18, 8], [3, 3, 0, 0, 12, 2], [4, 2, 0, 2, 6, 6], { form: "WLWWL", next: "Villarreal", prevPosition: 3, topScorer: "K. Mbappé (6)", cleanSheets: 2 }),
  ll(5, "Sevilla", "SEV", [7, 4, 1, 2, 10, 9], [4, 2, 0, 2, 5, 7], [3, 2, 1, 0, 5, 2], { form: "LDWWL", next: "Levante", prevPosition: 6, topScorer: "Y. En-Nesyri (3)", cleanSheets: 2 }),
  ll(6, "Alavés", "ALA", [7, 3, 2, 2, 11, 6], [4, 3, 0, 1, 9, 3], [3, 0, 2, 1, 2, 3], { form: "WWLLD", next: "Atlético Madrid", prevPosition: 5, topScorer: "K. Kike Garcia (3)", cleanSheets: 2 }),
  ll(7, "Deportivo La Coruña", "DEP", [7, 2, 4, 1, 10, 8], [4, 1, 2, 1, 5, 4], [3, 1, 2, 0, 5, 4], { form: "WWDLD", next: "Real Sociedad", prevPosition: 8, topScorer: "Lucas Pérez (3)", cleanSheets: 2 }),
  ll(8, "Real Sociedad", "RSO", [7, 3, 1, 3, 9, 13], [3, 1, 1, 1, 2, 4], [4, 2, 0, 2, 7, 9], { form: "WDWLW", next: "Deportivo La Coruña", prevPosition: 7, topScorer: "M. Oyarzabal (3)", cleanSheets: 1 }),
  ll(9, "Villarreal", "VIL", [7, 2, 2, 3, 13, 12], [3, 1, 0, 2, 6, 6], [4, 1, 2, 1, 7, 6], { form: "LLLWW", next: "Real Madrid", prevPosition: 11, topScorer: "A. Sorloth (4)", cleanSheets: 1 }),
  ll(10, "Athletic Bilbao", "ATH", [6, 2, 2, 2, 7, 6], [4, 1, 2, 1, 5, 4], [2, 1, 0, 1, 2, 2], { form: "LWWDD", next: "Rayo Vallecano", prevPosition: 9, topScorer: "I. Williams (2)", cleanSheets: 2 }),
  ll(11, "Getafe", "GET", [7, 2, 2, 3, 4, 7], [4, 2, 2, 0, 4, 2], [3, 0, 0, 3, 0, 5], { form: "LDDLW", next: "Barcelona", prevPosition: 10, topScorer: "B. Mayoral (2)", cleanSheets: 3 }),
  ll(12, "Rayo Vallecano", "RAY", [7, 2, 2, 3, 11, 16], [3, 2, 1, 0, 6, 4], [4, 0, 1, 3, 5, 12], { form: "LWLWD", next: "Athletic Bilbao", prevPosition: 13, topScorer: "A. Garcia (3)", cleanSheets: 1 }),
  ll(13, "Osasuna", "OSA", [7, 2, 2, 3, 6, 13], [4, 1, 2, 1, 2, 3], [3, 1, 0, 2, 4, 10], { form: "WLLLD", next: "Real Betis", prevPosition: 12, topScorer: "A. Budimir (2)", cleanSheets: 2 }),
  ll(14, "Celta Vigo", "CEL", [7, 1, 4, 2, 8, 6], [4, 1, 1, 2, 7, 5], [3, 0, 3, 0, 1, 1], { form: "LDDDW", next: "Elche", prevPosition: 15, topScorer: "I. Aspas (2)", cleanSheets: 2 }),
  ll(15, "Espanyol", "ESP", [7, 2, 1, 4, 10, 10], [4, 1, 1, 2, 6, 6], [3, 1, 0, 2, 4, 4], { form: "LDWLL", next: "Málaga", prevPosition: 14, topScorer: "J. Puado (3)", cleanSheets: 1 }),
  ll(16, "Racing de Santander", "RAC", [7, 2, 1, 4, 11, 21], [3, 2, 1, 0, 7, 5], [4, 0, 0, 4, 4, 16], { form: "WLWLL", next: "Valencia", prevPosition: 17, topScorer: "J. Arana (3)", cleanSheets: 1 }),
  ll(17, "Levante", "LEV", [6, 1, 2, 3, 8, 12], [2, 1, 0, 1, 7, 6], [4, 0, 2, 2, 1, 6], { form: "DWDLL", next: "Sevilla", prevPosition: 16, topScorer: "J. Morales (2)", cleanSheets: 1 }),
  ll(18, "Elche", "ELC", [7, 1, 2, 4, 11, 17], [3, 0, 0, 3, 4, 11], [4, 1, 2, 1, 7, 6], { form: "LLDLW", next: "Celta Vigo", prevPosition: 19, topScorer: "Pere Milla (2)", cleanSheets: 1 }),
  ll(19, "Valencia", "VAL", [7, 1, 1, 5, 4, 13], [4, 0, 1, 3, 2, 9], [3, 1, 0, 2, 2, 4], { form: "LLLWL", next: "Racing de Santander", prevPosition: 18, topScorer: "H. Duro (2)", cleanSheets: 1 }),
  ll(20, "Málaga", "MAL", [7, 0, 3, 4, 3, 12], [3, 0, 2, 1, 2, 4], [4, 0, 1, 3, 1, 8], { form: "LDDLL", next: "Espanyol", prevPosition: 20, topScorer: "D. Larrubia (1)", cleanSheets: 1 }),
];

export const LA_LIGA: League = {
  id: "laliga",
  name: "La Liga",
  season: "2025-2026",
  href: "/leagues/la-liga",
  zones: { ucl: 4, uel: 6, relegationFrom: 18, relegationLabel: "Xuống hạng Segunda División" },
  clubs: LA_LIGA_CLUBS,
};

// ==================== 3. SERIE A ====================
const SA_LOGOS = buildLogos("Italy - Serie A", {
  "Roma": "AS Roma",
  "Inter Milan": "Inter Milan",
  "Lazio": "SS Lazio",
  "Cagliari": "Cagliari Calcio",
  "AC Milan": "AC Milan",
  "Frosinone": "Frosinone Calcio",
  "Juventus": "Juventus FC",
  "Como": "Como 1907",
  "Napoli": "SSC Napoli",
  "Sassuolo": "US Sassuolo",
  "Atalanta": "Atalanta BC",
  "Lecce": "US Lecce",
  "Udinese": "Udinese Calcio",
  "Torino": "Torino FC",
  "Parma": "Parma Calcio 1913",
  "Monza": "AC Monza",
  "Fiorentina": "ACF Fiorentina",
  "Bologna": "Bologna FC 1909",
  "Genoa": "Genoa CFC",
  "Venezia": "Venezia FC",
});

const sa = makeClub(300, SA_LOGOS);
export const SERIE_A_CLUBS: Club[] = [
  sa(1, "Roma", "ROM", [5, 4, 1, 0, 14, 3], [3, 2, 1, 0, 8, 3], [2, 2, 0, 0, 6, 0], { form: "WWWWD", next: "Como", prevPosition: 1, topScorer: "P. Dybala (4)", cleanSheets: 3 }),
  sa(2, "Inter Milan", "INT", [5, 4, 1, 0, 15, 8], [3, 3, 0, 0, 12, 6], [2, 1, 1, 0, 3, 2], { form: "WWWWD", next: "Parma", prevPosition: 2, topScorer: "L. Martínez (5)", cleanSheets: 2 }),
  sa(3, "Lazio", "LAZ", [5, 4, 1, 0, 8, 3], [2, 1, 1, 0, 3, 2], [3, 3, 0, 0, 5, 1], { form: "WWWDW", next: "Monza", prevPosition: 3, topScorer: "C. Immobile (3)", cleanSheets: 3 }),
  sa(4, "Cagliari", "CAG", [5, 4, 0, 1, 5, 2], [2, 1, 0, 1, 1, 1], [3, 3, 0, 0, 4, 1], { form: "WLWWW", next: "Juventus", prevPosition: 5, topScorer: "Z. Luvumbo (2)", cleanSheets: 3 }),
  sa(5, "AC Milan", "MIL", [5, 3, 2, 0, 10, 4], [2, 2, 0, 0, 5, 0], [3, 1, 2, 0, 5, 4], { form: "WWDDW", next: "Sassuolo", prevPosition: 4, topScorer: "R. Leão (3)", cleanSheets: 3 }),
  sa(6, "Frosinone", "FRO", [5, 3, 1, 1, 9, 4], [3, 2, 0, 1, 5, 3], [2, 1, 1, 0, 4, 1], { form: "LWWDW", next: "Napoli", prevPosition: 8, topScorer: "M. Soule (3)", cleanSheets: 2 }),
  sa(7, "Juventus", "JUV", [5, 3, 1, 1, 8, 4], [3, 2, 1, 0, 5, 1], [2, 1, 0, 1, 3, 3], { form: "WWDLW", next: "Cagliari", prevPosition: 6, topScorer: "D. Vlahović (3)", cleanSheets: 2 }),
  sa(8, "Como", "COM", [5, 3, 1, 1, 9, 6], [1, 1, 0, 0, 2, 1], [4, 2, 1, 1, 7, 5], { form: "DWWWL", next: "Roma", prevPosition: 10, topScorer: "A. Cutrone (3)", cleanSheets: 1 }),
  sa(9, "Napoli", "NAP", [5, 2, 1, 2, 7, 6], [2, 1, 0, 1, 2, 2], [3, 1, 1, 1, 5, 4], { form: "WLLWD", next: "Frosinone", prevPosition: 7, topScorer: "V. Osimhen (3)", cleanSheets: 1 }),
  sa(10, "Sassuolo", "SAS", [5, 2, 1, 2, 9, 9], [2, 2, 0, 0, 5, 3], [3, 0, 1, 2, 4, 6], { form: "LWDWL", next: "AC Milan", prevPosition: 9, topScorer: "D. Berardi (3)", cleanSheets: 1 }),
  sa(11, "Atalanta", "ATA", [5, 2, 0, 3, 5, 7], [3, 2, 0, 1, 4, 3], [2, 0, 0, 2, 1, 4], { form: "WWLLL", next: "Venezia", prevPosition: 12, topScorer: "A. Lookman (2)", cleanSheets: 1 }),
  sa(12, "Lecce", "LEC", [5, 2, 0, 3, 5, 10], [2, 1, 0, 1, 3, 6], [3, 1, 0, 2, 2, 4], { form: "WLLWL", next: "Bologna", prevPosition: 11, topScorer: "N. Krstović (2)", cleanSheets: 1 }),
  sa(13, "Udinese", "UDI", [5, 1, 1, 3, 8, 11], [3, 0, 1, 2, 2, 4], [2, 1, 0, 1, 6, 7], { form: "DWLLL", next: "Torino", prevPosition: 14, topScorer: "L. Lucca (2)", cleanSheets: 1 }),
  sa(14, "Torino", "TOR", [5, 1, 1, 3, 5, 8], [2, 0, 0, 2, 1, 4], [3, 1, 1, 1, 4, 4], { form: "LLWLD", next: "Udinese", prevPosition: 13, topScorer: "D. Zapata (2)", cleanSheets: 1 }),
  sa(15, "Parma", "PAR", [5, 1, 1, 3, 4, 7], [3, 1, 1, 1, 3, 3], [2, 0, 0, 2, 1, 4], { form: "LLDLW", next: "Inter Milan", prevPosition: 16, topScorer: "D. Man (2)", cleanSheets: 1 }),
  sa(16, "Monza", "MON", [5, 1, 1, 3, 8, 12], [2, 1, 0, 1, 4, 4], [3, 0, 1, 2, 4, 8], { form: "LLDLW", next: "Lazio", prevPosition: 15, topScorer: "M. Pessina (2)", cleanSheets: 0 }),
  sa(17, "Fiorentina", "FIO", [5, 1, 1, 3, 6, 12], [3, 0, 1, 2, 2, 6], [2, 1, 0, 1, 4, 6], { form: "LLLWD", next: "Genoa", prevPosition: 18, topScorer: "N. González (2)", cleanSheets: 0 }),
  sa(18, "Bologna", "BOL", [5, 0, 2, 3, 3, 6], [3, 0, 2, 1, 3, 4], [2, 0, 0, 2, 0, 2], { form: "LLDLD", next: "Lecce", prevPosition: 17, topScorer: "J. Zirkzee (1)", cleanSheets: 0 }),
  sa(19, "Genoa", "GEN", [5, 0, 1, 4, 3, 10], [3, 0, 1, 2, 2, 7], [2, 0, 0, 2, 1, 3], { form: "LLLDL", next: "Fiorentina", prevPosition: 19, topScorer: "A. Gudmundsson (1)", cleanSheets: 0 }),
  sa(20, "Venezia", "VEN", [5, 0, 0, 5, 4, 13], [3, 0, 0, 3, 2, 8], [2, 0, 0, 2, 2, 5], { form: "LLLLL", next: "Atalanta", prevPosition: 20, topScorer: "J. Pohjanpalo (2)", cleanSheets: 0 }),
];

export const SERIE_A: League = {
  id: "seriea",
  name: "Serie A",
  season: "2025-2026",
  href: "/leagues/serie-a",
  zones: { ucl: 4, uel: 6, relegationFrom: 18, relegationLabel: "Xuống hạng Serie B" },
  clubs: SERIE_A_CLUBS,
};

// ==================== 4. BUNDESLIGA ====================
const BL_LOGOS = buildLogos("Germany - Bundesliga", {
  "Borussia Dortmund": "Borussia Dortmund",
  "Bayern Munich": "Bayern Munich",
  "SC Freiburg": "SC Freiburg",
  "FC Augsburg": "FC Augsburg",
  "Bayer Leverkusen": "Bayer 04 Leverkusen",
  "Mainz 05": "1.FSV Mainz 05",
  "SV Elversberg": "SV 07 Elversberg",
  "Werder Bremen": "SV Werder Bremen",
  "RB Leipzig": "RB Leipzig",
  "Eintracht Frankfurt": "Eintracht Frankfurt",
  "Schalke 04": "FC Schalke 04",
  "SC Paderborn": "SC Paderborn 07",
  "1. FC Köln": "1.FC Köln",
  "TSG Hoffenheim": "TSG 1899 Hoffenheim",
  "VfB Stuttgart": "VfB Stuttgart",
  "Hamburger SV": "Hamburger SV",
  "Union Berlin": "1.FC Union Berlin",
  "Borussia Mönchengladbach": "Borussia Mönchengladbach",
  "Borussia M'gladbach": "Borussia Mönchengladbach", // tên dùng ở `next`
});

const bl = makeClub(400, BL_LOGOS);
export const BUNDESLIGA_CLUBS: Club[] = [
  bl(1, "Borussia Dortmund", "BVB", [4, 4, 0, 0, 9, 2], [2, 2, 0, 0, 5, 0], [2, 2, 0, 0, 4, 2], { form: "WWWW", next: "Bayern Munich", prevPosition: 1, topScorer: "S. Guirassy (4)", cleanSheets: 2 }),
  bl(2, "Bayern Munich", "FCB", [4, 3, 1, 0, 14, 2], [2, 2, 0, 0, 12, 1], [2, 1, 1, 0, 2, 1], { form: "WDWW", next: "Borussia Dortmund", prevPosition: 2, topScorer: "H. Kane (5)", cleanSheets: 2 }),
  bl(3, "SC Freiburg", "SCF", [4, 3, 1, 0, 12, 3], [2, 2, 0, 0, 9, 1], [2, 1, 1, 0, 3, 2], { form: "WWDW", next: "Mainz 05", prevPosition: 4, topScorer: "V. Grifo (3)", cleanSheets: 2 }),
  bl(4, "FC Augsburg", "FCA", [4, 2, 1, 1, 11, 6], [2, 1, 1, 0, 5, 2], [2, 1, 0, 1, 6, 4], { form: "WLWD", next: "Bayer Leverkusen", prevPosition: 6, topScorer: "E. Demirović (3)", cleanSheets: 1 }),
  bl(5, "Bayer Leverkusen", "B04", [4, 2, 1, 1, 10, 5], [2, 2, 0, 0, 6, 0], [2, 0, 1, 1, 4, 5], { form: "LDWW", next: "FC Augsburg", prevPosition: 3, topScorer: "F. Wirtz (3)", cleanSheets: 2 }),
  bl(6, "Mainz 05", "M05", [4, 2, 1, 1, 10, 6], [2, 0, 1, 1, 1, 3], [2, 2, 0, 0, 9, 3], { form: "WWDL", next: "SC Freiburg", prevPosition: 5, topScorer: "J. Burkardt (3)", cleanSheets: 1 }),
  bl(7, "SV Elversberg", "ELV", [4, 2, 1, 1, 8, 7], [2, 1, 0, 1, 4, 4], [2, 1, 1, 0, 4, 3], { form: "WDWL", next: "Werder Bremen", prevPosition: 8, topScorer: "L. Schnellbacher (2)", cleanSheets: 1 }),
  bl(8, "Werder Bremen", "SVW", [4, 2, 1, 1, 8, 8], [2, 2, 0, 0, 6, 3], [2, 0, 1, 1, 2, 5], { form: "LDWW", next: "SV Elversberg", prevPosition: 7, topScorer: "M. Ducksch (2)", cleanSheets: 1 }),
  bl(9, "RB Leipzig", "RBL", [4, 2, 0, 2, 9, 5], [2, 2, 0, 0, 8, 0], [2, 0, 0, 2, 1, 5], { form: "LWLW", next: "Schalke 04", prevPosition: 10, topScorer: "L. Openda (3)", cleanSheets: 2 }),
  bl(10, "Eintracht Frankfurt", "SGE", [4, 1, 2, 1, 9, 10], [2, 0, 1, 1, 3, 6], [2, 1, 1, 0, 6, 4], { form: "DWLD", next: "SC Paderborn", prevPosition: 9, topScorer: "O. Marmoush (3)", cleanSheets: 0 }),
  bl(11, "Schalke 04", "S04", [4, 1, 2, 1, 3, 4], [2, 0, 2, 0, 0, 0], [2, 1, 0, 1, 3, 4], { form: "LDWD", next: "RB Leipzig", prevPosition: 12, topScorer: "K. Karaman (2)", cleanSheets: 2 }),
  bl(12, "SC Paderborn", "SCP", [4, 1, 1, 2, 3, 5], [2, 1, 0, 1, 3, 2], [2, 0, 1, 1, 0, 3], { form: "LWDL", next: "Eintracht Frankfurt", prevPosition: 11, topScorer: "F. Platte (1)", cleanSheets: 1 }),
  bl(13, "1. FC Köln", "KOE", [4, 1, 1, 2, 6, 9], [2, 1, 1, 0, 4, 3], [2, 0, 0, 2, 2, 6], { form: "LLWD", next: "TSG Hoffenheim", prevPosition: 13, topScorer: "D. Selke (2)", cleanSheets: 0 }),
  bl(14, "TSG Hoffenheim", "TSG", [4, 1, 0, 3, 7, 10], [2, 1, 0, 1, 4, 4], [2, 0, 0, 2, 3, 6], { form: "LLLW", next: "1. FC Köln", prevPosition: 15, topScorer: "A. Kramarić (2)", cleanSheets: 0 }),
  bl(15, "VfB Stuttgart", "VFB", [4, 1, 0, 3, 6, 9], [2, 1, 0, 1, 4, 2], [2, 0, 0, 2, 2, 7], { form: "WLLL", next: "Hamburger SV", prevPosition: 14, topScorer: "E. Millot (2)", cleanSheets: 1 }),
  bl(16, "Hamburger SV", "HSV", [4, 1, 0, 3, 2, 13], [2, 1, 0, 1, 2, 6], [2, 0, 0, 2, 0, 7], { form: "LLWL", next: "VfB Stuttgart", prevPosition: 16, topScorer: "R. Glatzel (1)", cleanSheets: 0 }),
  bl(17, "Union Berlin", "UNB", [4, 0, 1, 3, 4, 17], [2, 0, 1, 1, 4, 6], [2, 0, 0, 2, 0, 11], { form: "LLLD", next: "Borussia M'gladbach", prevPosition: 17, topScorer: "R. Gosens (1)", cleanSheets: 0 }),
  bl(18, "Borussia Mönchengladbach", "BMG", [4, 0, 0, 4, 6, 16], [2, 0, 0, 2, 6, 8], [2, 0, 0, 2, 0, 8], { form: "LLLL", next: "Union Berlin", prevPosition: 18, topScorer: "A. Pléa (2)", cleanSheets: 0 }),
];

export const BUNDESLIGA: League = {
  id: "bundesliga",
  name: "Bundesliga",
  season: "2025-2026",
  href: "/leagues/bundesliga",
  zones: { ucl: 4, uel: 6, relegationFrom: 16, relegationLabel: "Play-off / Xuống hạng 2. Bundesliga" },
  clubs: BUNDESLIGA_CLUBS,
};

// ==================== 5. LIGUE 1 ====================
const L1_LOGOS = buildLogos("France - Ligue 1", {
  "Monaco": "AS Monaco",
  "Lyon": "Olympique Lyon",
  "Paris FC": "Paris FC",
  "Lille": "LOSC Lille",
  "Rennes": "Stade Rennais FC",
  "Paris Saint-Germain": "Paris Saint-Germain",
  "PSG": "Paris Saint-Germain", // tên dùng ở `next`
  "Angers": "Angers SCO",
  "Strasbourg": "RC Strasbourg Alsace",
  "Le Mans": "Le Mans FC",
  "Auxerre": "AJ Auxerre",
  "Brest": "Stade Brestois 29",
  "Lorient": "FC Lorient",
  "Toulouse": "FC Toulouse",
  "Nice": "OGC Nice",
  "Lens": "RC Lens",
  "Troyes": "ESTAC Troyes",
  "Marseille": "Olympique Marseille",
  "Le Havre": "Le Havre AC",
});

const l1 = makeClub(500, L1_LOGOS);
export const LIGUE_1_CLUBS: Club[] = [
  l1(1, "Monaco", "ASM", [5, 4, 1, 0, 8, 3], [2, 2, 0, 0, 4, 1], [3, 2, 1, 0, 4, 2], { form: "WDWWW", next: "Lyon", prevPosition: 1, topScorer: "F. Balogun (3)", cleanSheets: 3 }),
  l1(2, "Lyon", "OL", [5, 3, 2, 0, 10, 2], [3, 2, 1, 0, 8, 2], [2, 1, 1, 0, 2, 0], { form: "WDWDW", next: "Monaco", prevPosition: 2, topScorer: "A. Lacazette (4)", cleanSheets: 3 }),
  l1(3, "Paris FC", "PFC", [5, 3, 2, 0, 8, 3], [3, 2, 1, 0, 5, 1], [2, 1, 1, 0, 3, 2], { form: "WDWWD", next: "Lille", prevPosition: 4, topScorer: "J. Kebbal (3)", cleanSheets: 2 }),
  l1(4, "Lille", "LIL", [5, 3, 1, 1, 8, 4], [2, 1, 1, 0, 4, 2], [3, 2, 0, 1, 4, 2], { form: "LWWDW", next: "Paris FC", prevPosition: 3, topScorer: "J. David (3)", cleanSheets: 2 }),
  l1(5, "Rennes", "REN", [5, 3, 1, 1, 8, 9], [3, 2, 1, 0, 6, 4], [2, 1, 0, 1, 2, 5], { form: "LWWWD", next: "PSG", prevPosition: 5, topScorer: "A. Gouiri (3)", cleanSheets: 1 }),
  l1(6, "Paris Saint-Germain", "PSG", [5, 2, 2, 1, 8, 7], [1, 0, 0, 1, 1, 2], [4, 2, 2, 0, 7, 5], { form: "WWLDD", next: "Rennes", prevPosition: 6, topScorer: "B. Barcola (3)", cleanSheets: 1 }),
  l1(7, "Angers", "ANG", [5, 2, 1, 2, 6, 5], [3, 1, 0, 2, 3, 4], [2, 1, 1, 0, 3, 1], { form: "WDLWL", next: "Strasbourg", prevPosition: 8, topScorer: "L. Diony (2)", cleanSheets: 2 }),
  l1(8, "Strasbourg", "STR", [5, 2, 1, 2, 10, 10], [2, 1, 1, 0, 3, 2], [3, 1, 0, 2, 7, 8], { form: "LDWWL", next: "Angers", prevPosition: 7, topScorer: "E. Emegha (3)", cleanSheets: 1 }),
  l1(9, "Le Mans", "LEM", [5, 1, 3, 1, 9, 9], [3, 1, 2, 0, 6, 5], [2, 0, 1, 1, 3, 4], { form: "WDDLD", next: "Auxerre", prevPosition: 9, topScorer: "A. Gnanduillet (2)", cleanSheets: 1 }),
  l1(10, "Auxerre", "AUX", [5, 2, 0, 3, 7, 12], [3, 2, 0, 1, 4, 4], [2, 0, 0, 2, 3, 8], { form: "WWLLL", next: "Le Mans", prevPosition: 11, topScorer: "G. Hein (2)", cleanSheets: 1 }),
  l1(11, "Brest", "BRE", [5, 1, 2, 2, 7, 8], [2, 0, 1, 1, 2, 3], [3, 1, 1, 1, 5, 5], { form: "LLWDD", next: "Lorient", prevPosition: 10, topScorer: "R. Del Castillo (2)", cleanSheets: 1 }),
  l1(12, "Lorient", "LOR", [5, 1, 2, 2, 5, 6], [2, 0, 1, 1, 3, 4], [3, 1, 1, 1, 2, 2], { form: "LDWLD", next: "Brest", prevPosition: 12, topScorer: "B. Dieng (2)", cleanSheets: 1 }),
  l1(13, "Toulouse", "TOU", [5, 1, 2, 2, 7, 9], [3, 1, 0, 2, 3, 5], [2, 0, 2, 0, 4, 4], { form: "WDLDL", next: "Nice", prevPosition: 13, topScorer: "T. Dallinga (2)", cleanSheets: 1 }),
  l1(14, "Nice", "NIC", [5, 1, 2, 2, 3, 6], [3, 1, 2, 0, 3, 2], [2, 0, 0, 2, 0, 4], { form: "WLDLD", next: "Toulouse", prevPosition: 14, topScorer: "T. Moffi (1)", cleanSheets: 1 }),
  l1(15, "Lens", "LEN", [5, 1, 1, 3, 9, 9], [2, 1, 0, 1, 5, 3], [3, 0, 1, 2, 4, 6], { form: "LDLLW", next: "Troyes", prevPosition: 16, topScorer: "E. Wahi (2)", cleanSheets: 1 }),
  l1(16, "Troyes", "TRO", [5, 1, 1, 3, 4, 11], [2, 0, 1, 1, 2, 6], [3, 1, 0, 2, 2, 5], { form: "LLLWD", next: "Lens", prevPosition: 15, topScorer: "R. Ripart (1)", cleanSheets: 1 }),
  l1(17, "Marseille", "OM", [5, 1, 0, 4, 7, 8], [3, 1, 0, 2, 7, 5], [2, 0, 0, 2, 0, 3], { form: "LLLLW", next: "Le Havre", prevPosition: 17, topScorer: "P. Aubameyang (2)", cleanSheets: 1 }),
  l1(18, "Le Havre", "HAC", [5, 0, 2, 3, 4, 7], [3, 0, 1, 2, 1, 3], [2, 0, 1, 1, 3, 4], { form: "LDLDL", next: "Marseille", prevPosition: 18, topScorer: "M. Bayo (1)", cleanSheets: 0 }),
];

export const LIGUE_1: League = {
  id: "ligue1",
  name: "Ligue 1",
  season: "2025-2026",
  href: "/leagues/ligue-1",
  zones: { ucl: 3, uel: 5, relegationFrom: 16, relegationLabel: "Play-off / Xuống hạng Ligue 2" },
  clubs: LIGUE_1_CLUBS,
};

// ==================== TỔNG HỢP TẤT CẢ GIẢI ĐẤU ====================
export const ALL_LEAGUES: League[] = [
  PREMIER_LEAGUE,
  LA_LIGA,
  SERIE_A,
  BUNDESLIGA,
  LIGUE_1,
];