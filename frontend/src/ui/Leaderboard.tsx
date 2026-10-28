import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  Trophy,
  Calendar,
  Newspaper,
  TrendingUp,
  SlidersHorizontal,
  X
} from 'lucide-react';
import type { Club, League } from '../data_tsx/mock_standing';
import { PREMIER_LEAGUE_CLUBS , LA_LIGA_CLUBS , SERIE_A_CLUBS, BUNDESLIGA_CLUBS, LIGUE_1_CLUBS , } from '../data_tsx/mock_standing';

export const LEAGUES: League[] = [
  {
    id: "premier-league",
    name: "Premier League",
    season: "2026/27",
    href:"data:image/png;base64,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",
    zones: { ucl: 4, uel: 5, relegationFrom: 18, relegationLabel: "Relegation to Championship" },
    clubs: PREMIER_LEAGUE_CLUBS
  },
  {
    id: "la-liga",
    name: "La Liga",
    season: "2026/27",
    href:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACi0lEQVR4Ae3aA8wdURQE4Nq27TZObdu2bdttVNs249q2bdv26dTuzin+u7u5k3zheyeZtQL9o9jY2NjY2NjY2NjY2NhI0XwhICfkJhSA0A7zgkBmyK2YGcvkAugOQtoKIRzmVQJReAQpTJVPB69BSGEc5kWF2yAKhU2u/RsgpOLEvIPK8gNNlh8KQppGzGupLH/WZPnsIKQTEMlhXhrlrvQSspoqHw4ugJAyEEf93SAKvU2u/TkgpM7EvFHK8qtNlq8GQjpEzCuqLP8UEpgqHx6eghCeQEpi5gMQhcom1/5iEFIbYt4sL236jUFI84h5tZTlL0NIU+VTw30QwnWI7DAvBdzy0tXeNhBSQWLeBmX54SbLdwQhzebn0U5BMJObvpBO6OdRopsqHwYOgRBeQGZi3hFl+Y4mN/1+IKQuxLxByvIbTZZPpLhA2U7My68s/xASmFwAVUEIr4kHHJHhHohCGdPP+JqBECZCRsj9E/khKyxXlp9gsDpx1cc7DctAFO675Slvpr8ofhaKQzR4DKKQz0Bd4saHsxdKaK8ev9Lfbc/6Y5MPPPdBUQj81X/7KMtvhZBufOGRBeQXLkBDCPbdfzLDGxDSc0jruvK/WZt3oD4E+cXvb4IotPDCq695cAnqOfxumjcecOgXQDDigqeEsvxNiOmXl6Ox4RKIQhU/vR1eqiw/1U/lS5l9nWV+AawAUUjrtwVwB4Q07uN/IvxGDAjtpQUgpDdwG+7/xAN4CgLzIZGXFsBOojxjHWTx4i5Q7y+Lr4SsXj8O7AJR2gz5/XIgTAKPyOLbII/3W+u/GNkLhfz+vWDbnxTfAcUgMD/JHxdGR6CcL0sS3/mVCGRjY2NjY2Nj47K8BUsex3t6F/CmAAAAAElFTkSuQmCC",
    zones: { ucl: 4, uel: 5, relegationFrom: 18, relegationLabel: "Relegation to Segunda División" },
    clubs: LA_LIGA_CLUBS
  },
  {
    id: "serie-a",
    name: "Serie A",
    season: "2026/27",
    href:"data:image/png;base64,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",
    zones: { ucl: 4, uel: 5, relegationFrom: 18, relegationLabel: "Relegation to Serie B" },
    clubs: SERIE_A_CLUBS
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    season: "2026/27",
    href:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAaVBMVEX////////7+vr57O3PAAD89PTSBRXSAA/RAADsv7/03d3XU1baa27wz8/gkZLjnp/or7DegoTUJCz35+fz8/O8vLyysrLLy8vb29vl5eWhoaHt7e0AAACTk5NKSkp2dnZjY2M3NzclJSVR4BkSAAAAAnRSTlP/9F9nBk8AAAJPSURBVHgB7NTRboQgEIXhaTkOB0RFfP937Sqm7BrNdupd0//SxC9kmCA3+5C9f+DT/aJnwAH2uhdAzb0BPADeADyCiz1+CXivCPIo0Q4QALlPaIAZwNjVD7I20gpgkOcmK4Asz3VqBDCL5D7lz309R+MtoIhMIKU2GffAY+4kQTlJDV4tgC9ZpLDNMUBNAPsoGet3J/JmiUienmDbXI99grgEkMaCkxmQm97L1pIUwNkcENcVw+Uqz/KdiwE4nmQfMv0VkOSlJSQ0pS3rzAtAIcc6F7OvRNvWYgC2hh7VqEcP0Eugk/NcTlgjpjBDr4G4HTs+WpYh5xyG57HGAZ6gXgMIspbR6nMID8dt+zHxfBOP1xSh7RNq63aA+g4o9fqgxzCN4A8eVYSr55D0+gOAPADmZx3xHkCMhyHaAJYodwCk9qKbAYCYZa1LUDuAnMu0bVsoVCvQ3qJhBqh2oC6Qm9rfRoCjiEtoy2YFECWA2jIDS4TqDYB98bcApdc7AM29AN08mpsbcKe/A3xxOR82DIUwEEBPnsEYDEfdf8jE6fkquD+hKVlGyRDTYgpPSCllxGvwWjPMgWaCEgWKtT+g0YylDyjdOJEIzsoZbwe73Z84oyTWe4HBfgFc6XUFYIsl7zgIxpo0ZsELwKgQiX1egLUWXsDMfAKZ4DkGG5xvgOYkLOp/QMBUxxPA2CMWKt9rhW9gTihxSM5/YGy6k9zxD+cBSeZ4qTyckY1CcfLQKSjUHwCqGsEdEI3y1dEI4u2V6XNHIqrcBjNgNCkzUggAHjNN7Eqme54AAAAASUVORK5CYII=",
    zones: { ucl: 4, uel: 5, relegationFrom: 17, relegationLabel: "Relegation to 2. Bundesliga" },
    clubs: BUNDESLIGA_CLUBS
  },
  {
    id: "ligue-1",
    name: "Ligue 1",
    season: "2026/27",
    href:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAACvlBMVEUAAAAlJSUmJiY1NTUrKytcXFyXl5fR0dH9/f1BQUEnJydMTEyGhobBwcH29vb////e3t48PDx2dnawsLDq6uqioqI9PT3a2tr+/v5mZmaIiIjz8/O+vr7AwMD5+fkwMDDV1dXCwsIpKSmysrLHx8c2Nja7u7uAgIDt7e2KiopeXl5CQkJRUVFOTk6cnJzd3d2NjY2goKDJycmvr68/Pz9iYmIxMTH6+vpzc3N8fHwtLS1oaGg4ODi6urqjo6PU1NSCgoLf39+YmJhERESamprg4OB+fn709PTY2Ni8vLxkZGQqKiry8vJ6enr39/cuLi5ZWVm4uLiVlZXh4eGEhIRaWlpxcXFYWFhbW1tGRkbW1tb4+PhAQEB5eXmlpaVISEg0NDRqamqFhYVXV1c5OTk3NzeZmZl/f39nZ2dtbW1QUFBUVFSWlpZSUlLm5uYsLCzOzs6np6eoqKh9fX0oKChra2u3t7empqZPT0+Pj49wcHBfX1+kpKRKSkphYWFubm6/v7+zs7N4eHiMjIx3d3eRkZHZ2dm0tLRycnJDQ0MzMzM7Oztvb2+Dg4NWVlY6Ojo+Pj45MyTCkhTmqxCkfRgqKSZvWR3ephG5jBUyLiUnJibJlhOWdBlXSCD8ug2JahtWRyDusA9EOyKziBa3ihVlUh/4tw67jRXfphHLmBOceBhJPiL/vA1TRSG9jhV5XxxsVh5aSiDhpxCqgRcvLSX5uA6ScRpIPSLnrBD7uQ0tKyWxhhbtsA8oJyZhTx9tVx4oKCbcpBGMbBpPQiGPbxpOQiG+jxV9Yhy1iRY2MSTFlBSmfhdVRiGjfBjUnhL6uQ0nJyazhxaUchlBOSPBkRTrrg/srw+lfheGaRvZohHhpxGdeRj+uw3qrhAwLSWZdRl4Xx32tg7VnxJCOSNcTCA6NCT0tA5WRyFMQCJVRyHseI1EAAAAAnRSTlMAbUWQ0N0AAAKMSURBVHgB1NbTYh1RAEbh9o+5Ytu2zbqxbdtmjeCJ6wZXPbPrdT/faOvOze7Kpu7euug/AuzszAHZOzg6ObsYAq5u7h6egJdMAG8fXz8AwN8ACAgM4qpgAyAEAELDwiEi0gCIAiA6RrEQJ+tAfEJCOJAo1yRINgAkpQCpSgPSzYAMyJSywM/VDAiEbCkHcmUE5AH5KiiEIjOgGDxLVApBZWZAOYRLFVApI8A+FKqkaqgxAxyAWqUCDmZAHdRL9+C+vRnwAPylcngoIyAgCB7p8RNINAOeQkOjmoBaM6AZoqUWaJUR8PnZ26T2jo5OM6AL6NZV1oGaq2c3BHrAufdrfSaAdxDfq5cJ0M9VA0ZA2eBVQ390cx0ekTQ6MqZx94nJSE2NxGi6SpMTExMzkmaDfwh4IGmO+aEFIEcJLCouQkvAsmbrWbEZ6Gd1LZyyK0CS1jcsAHW4aWK55BagPAvAJqlalK6Ara1Fa8AKedsJCU1XAKH2loHcSnaugI5dWQP2cFE/0+bfoIV9tXFgAnR0tH8CDslKPSLvmJPpzM/A6ekzWwF4/gkoeQG81CvoyfkMgL9twOutra03b7ca1fju/YGrdFaUWpuu+PPz80bJfuvifz7qGgCXHzmZByOJAiiKglUn/8La9u5djW3btuKYGN7vAPrw6PgETs/OLxwFl1fXN7d33D88Pj07Cl5eL3h75+OTL307CX4O4Vd/+geX20Hg8frAr0AwBOFI1B7EFIfEq5JASml7kFEWSCoHxJW3BwUVgZLKQEVVe1CrN4CmWkBbHXvQ7QH0NQAuNDQHjdsRwFh5IDqZmoOZhgBzLQBel+agqBXAerMF2N2ag5P9nr9A4q19CWMNwwIFANJS1JaLG8jUAAAAAElFTkSuQmCC",
    zones: { ucl: 4, uel: 5, relegationFrom: 17, relegationLabel: "Relegation to Ligue 2" },
    clubs: LIGUE_1_CLUBS
  }
];
function ClubCrest({ src, alt, fallback, size }: { src?: string; alt: string; fallback: string; size: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-slate-700 text-[9px] font-bold text-slate-200`}>
        {fallback}
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={`${size} object-contain`} onError={() => setFailed(true)} />;
}

const VIEW_OPTIONS = [
  { id: "all", label: "Tổng" },
  { id: "home", label: "Sân nhà" },
  { id: "away", label: "Sân khách" },
];

const FORM_STYLES: Record<string, string> = {
  W: "bg-emerald-500 text-white",
  D: "bg-slate-600 text-slate-100",
  L: "bg-rose-600 text-white",
};

const FORM_TITLES: Record<string, string> = { W: "Thắng", D: "Hoà", L: "Thua" };

type SortState = { sortField: string; sortAsc: boolean; onSort: (field: string) => void };

function SortableHead({ field, label, title, className, sort }: { field: string; label: string; title: string; className?: string; sort: SortState }) {
  const active = sort.sortField === field;
  return (
    <th
      scope="col"
      title={title}
      aria-sort={active ? (sort.sortAsc ? "ascending" : "descending") : "none"}
      onClick={() => sort.onSort(field)}
      className={`cursor-pointer select-none whitespace-nowrap px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-white ${active ? "text-cyan-200" : "text-slate-400"} ${className ?? ""}`}
    >
      <span className="inline-flex items-center justify-center gap-1">
        {label}
        {active && (sort.sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </span>
    </th>
  );
}

function TeamDetails({ team }: { team: Club }) {
  return (
    <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Mùa này</span>
          <TrendingUp className="h-4 w-4 text-blue-400" />
        </div>
        <dl className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">Vua phá lưới</dt>
            <dd className="truncate font-semibold text-slate-100">{team.topScorer ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">Giữ sạch lưới</dt>
            <dd className="font-semibold text-slate-100">{team.cleanSheets !== undefined ? `${team.cleanSheets} trận` : "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">Điểm / trận</dt>
            <dd className="font-semibold text-slate-100">{team.played > 0 ? (team.points / team.played).toFixed(2) : "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Sân nhà / Sân khách</span>
          <SlidersHorizontal className="h-4 w-4 text-blue-400" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg bg-slate-900/70 p-2">
            <div className="text-[10px] font-bold uppercase text-slate-500">Sân nhà</div>
            <div className="mt-1 text-sm font-bold text-slate-100">
              {team.homeStats.won}T - {team.homeStats.drawn}H - {team.homeStats.lost}B
            </div>
            <div className="text-[10px] font-semibold text-cyan-300">{team.homeStats.pts} điểm</div>
          </div>
          <div className="rounded-lg bg-slate-900/70 p-2">
            <div className="text-[10px] font-bold uppercase text-slate-500">Sân khách</div>
            <div className="mt-1 text-sm font-bold text-slate-100">
              {team.awayStats.won}T - {team.awayStats.drawn}H - {team.awayStats.lost}B
            </div>
            <div className="text-[10px] font-semibold text-cyan-300">{team.awayStats.pts} điểm</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Trận tiếp theo</span>
            <Calendar className="h-4 w-4 text-blue-400" />
          </div>
          {team.nextOpponent ? (
            <div className="flex items-center justify-around py-1">
              <div className="flex flex-col items-center gap-1 text-center">
                <ClubCrest src={team.logoUrl} alt="" fallback={team.shortName} size="h-8 w-8" />
                <span className="text-[11px] font-bold text-slate-200">{team.shortName}</span>
              </div>
              <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-300">vs</span>
              <div className="flex max-w-28 flex-col items-center gap-1 text-center">
                <ClubCrest
                  src={team.nextOpponent.logo}
                  alt=""
                  fallback={team.nextOpponent.name.slice(0, 3).toUpperCase()}
                  size="h-8 w-8"
                />
                <span className="truncate text-[11px] font-bold text-slate-200">{team.nextOpponent.name}</span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-slate-500">Chưa có dữ liệu trận tiếp theo</div>
          )}
        </div>
        <Link
          to="/?q=football"
          className="mt-3 block rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-200 transition-colors hover:border-blue-500 hover:bg-blue-600 hover:text-white"
        >
          Đọc tin tức trận đấu
        </Link>
      </div>
    </div>
  );
}

export default function FootballStandings({
  leagues = LEAGUES,
  leagueName,
  season
}: {
  leagues?: League[];
  leagueName?: string;
  season?: string;
}): React.JSX.Element {
  const findLeagueId = (key?: string) => {
    if (!key) return leagues[0].id;
    const k = key.trim().toLowerCase();
    return (
      leagues.find((l) => l.id.toLowerCase() === k || l.name.toLowerCase() === k)?.id ?? leagues[0].id
    );
  };

  const [activeLeagueId, setActiveLeagueId] = useState<string>(() => findLeagueId(leagueName));
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState("all");
  const [sortField, setSortField] = useState("position");
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

  useEffect(() => {
    setActiveLeagueId(findLeagueId(leagueName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueName]);

  const league = leagues.find((l) => l.id === activeLeagueId) ?? leagues[0];
  const standingsData = league.clubs;
  const currentSeason = season ?? league.season;
  const matchday = Math.max(0, ...standingsData.map((t) => t.played));
  const isSplitView = selectedView !== "all";

  const changeLeague = (id: string) => {
    setActiveLeagueId(id);
    setExpandedTeamId(null);
    setSearchQuery("");
    setSortField("position");
    setSortAsc(true);
  };

  const newsItems = [
    { id: 1, text: "Alonso tiết lộ thời điểm João Pedro trở lại sau chấn thương.", tag: "Tin chuyển nhượng" },
    { id: 2, text: "Sang Le và Duy Tân sẽ tái ngộ ở Man United.", tag: "Matchday" },
    { id: 3, text: "Thầy Cần xác nhận giải nghệ ở Arsenal.", tag: "Hậu trường" }
  ];

  const handleSort = (field: React.SetStateAction<string>) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === "teamName" || field === "position");
    }
  };

  const sortState: SortState = { sortField, sortAsc, onSort: handleSort };

  const processedStandings = useMemo(() => {
    let result = standingsData.map((team) => {
      const stats = { ...team };
      if (selectedView === "home") {
        stats.played = team.homeStats.played;
        stats.won = team.homeStats.won;
        stats.drawn = team.homeStats.drawn;
        stats.lost = team.homeStats.lost;
        stats.goalsFor = team.homeStats.gf;
        stats.goalsAgainst = team.homeStats.ga;
        stats.goalDifference = team.homeStats.gf - team.homeStats.ga;
        stats.points = team.homeStats.pts;
      } else if (selectedView === "away") {
        stats.played = team.awayStats.played;
        stats.won = team.awayStats.won;
        stats.drawn = team.awayStats.drawn;
        stats.lost = team.awayStats.lost;
        stats.goalsFor = team.awayStats.gf;
        stats.goalsAgainst = team.awayStats.ga;
        stats.goalDifference = team.awayStats.gf - team.awayStats.ga;
        stats.points = team.awayStats.pts;
      }
      return stats;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (team) =>
          team.teamName.toLowerCase().includes(query) ||
          team.shortName.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField as keyof typeof a];
      const bVal = b[sortField as keyof typeof b];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;

      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: "base" });
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else {
        comparison = aVal > bVal ? 1 : -1;
      }

      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [standingsData, searchQuery, selectedView, sortField, sortAsc]);

  // Vạch màu trái chỉ có nghĩa ở bảng tổng; bảng sân nhà/khách không xếp suất châu Âu
  const getQualificationStrip = (position: number) => {
    if (isSplitView) return "border-l-transparent";
    const { ucl, uel, relegationFrom } = league.zones;
    if (position <= ucl) return "border-l-blue-500";
    if (position <= uel) return "border-l-amber-500";
    if (position >= relegationFrom) return "border-l-rose-600";
    return "border-l-transparent";
  };

  const renderMovement = (current: number, prev?: number) => {
    if (prev === undefined) return null;
    if (current < prev) return <ArrowUp className="h-3 w-3 text-emerald-400" aria-label="Lên hạng" />;
    if (current > prev) return <ArrowDown className="h-3 w-3 text-rose-400" aria-label="Xuống hạng" />;
    return <Minus className="h-2.5 w-2.5 text-slate-600" aria-label="Giữ nguyên hạng" />;
  };

  const renderForm = (form: string[], compact = false) => {
    if (form.length === 0) return <span className="text-slate-600">—</span>;
    return (
      <div className={`flex items-center ${compact ? "gap-1" : "gap-1.5"}`}>
        {form.map((res, idx) => (
          <span
            key={idx}
            title={`${FORM_TITLES[res] ?? res} (${idx + 1})`}
            className={`flex items-center justify-center rounded-full text-[10px] font-bold ${compact ? "h-4 w-4" : "h-5 w-5"} ${FORM_STYLES[res] ?? "bg-slate-700 text-slate-200"}`}
          >
            {res}
          </span>
        ))}
      </div>
    );
  };


  const toggleRow = (id: number) => setExpandedTeamId(expandedTeamId === id ? null : id);

  const onRowKeyDown = (event: React.KeyboardEvent, id: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleRow(id);
    }
  };


  return (
    <section
      aria-labelledby="standings-heading"
      className="w-full scroll-mt-16 border-t border-slate-800/80 pt-8 font-sans-custom text-slate-200 selection:bg-blue-500/30"
    >
      {/* Đầu bài viết như một chuyên mục của toà soạn */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-1">
            <img src={league.href} alt={`Logo ${league.name}`} className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">
              <Trophy className="h-3.5 w-3.5" /> Bảng xếp hạng
            </span>
            <h2 id="standings-heading" className="mt-1.5 text-lg font-extrabold uppercase tracking-wide text-white sm:text-xl">
              BXH {league.name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Mùa {currentSeason} • Vòng {matchday} • {processedStandings.length}/{standingsData.length} đội • Cập nhật 29/09/2026
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="standings-panel"
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:border-blue-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 sm:self-auto"
        >
          {isOpen ? "Thu gọn" : "Mở bảng xếp hạng"}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Chọn giải theo kiểu thanh chuyên mục */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {leagues.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => changeLeague(l.id)}
            aria-pressed={l.id === league.id}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
              l.id === league.id
                ? "border border-blue-600 bg-blue-600/15 text-cyan-200 shadow-md shadow-blue-600/25"
                : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <img src={l.href} alt="" className="h-4 w-4 object-contain" />
            {l.name}
          </button>
        ))}
      </div>

      {/* Tin liên quan tới giải đang xem */}
      <div className="mt-3 flex flex-col gap-1.5 rounded-xl border border-slate-800/70 bg-slate-900/50 px-4 py-2.5 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
        <span className="inline-flex shrink-0 items-center gap-1.5 font-bold uppercase tracking-wider text-red-500">
          <Newspaper className="h-3.5 w-3.5" /> Tin {league.name}
        </span>
        {newsItems.map((item) => (
          <span key={item.id} className="flex min-w-0 items-center gap-2 text-slate-300">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span className="truncate">{item.text}</span>
            <span className="hidden rounded border border-slate-700 bg-slate-950/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-400 sm:inline">
              {item.tag}
            </span>
          </span>
        ))}
      </div>

      {isOpen && (
        <div
          id="standings-panel"
          className="mt-4 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl shadow-black/20"
        >
          {/* Thanh công cụ */}
          <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                placeholder="Tìm đội bóng..."
                aria-label="Tìm đội bóng"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 py-2 pl-9 pr-9 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Xoá tìm kiếm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl border border-slate-800 bg-slate-950/50 p-1" role="group" aria-label="Xem thành tích">
                {VIEW_OPTIONS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedView(v.id)}
                    aria-pressed={selectedView === v.id}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                      selectedView === v.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              <label className="sr-only" htmlFor="season-select">Mùa giải</label>
              <select
                id="season-select"
                value={currentSeason}
                onChange={() => undefined}
                className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-1.5 text-xs font-semibold text-slate-300 focus:border-blue-500/60 focus:outline-none"
              >
                <option value={currentSeason}>Mùa {currentSeason}</option>
              </select>
            </div>
          </div>

          {isSplitView && (
            <p className="border-b border-slate-800 bg-slate-950/40 px-4 py-2 text-[11px] text-slate-500">
              Đang xem thành tích {selectedView === "home" ? "sân nhà" : "sân khách"} — thứ hạng và suất châu Âu chỉ áp dụng cho bảng Tổng.
            </p>
          )}

          {processedStandings.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <Search className="h-6 w-6 text-slate-600" />
              <p className="text-sm text-slate-400">
                Không tìm thấy đội nào khớp với "<span className="font-bold text-slate-100">{searchQuery}</span>"
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 transition-colors hover:border-blue-500 hover:text-white"
              >
                Xoá bộ lọc
              </button>
            </div>
          ) : (
            <>
              {/* Bảng đầy đủ cho desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left text-xs">
                  <caption className="sr-only">
                    Bảng xếp hạng {league.name}, mùa {currentSeason}. Bấm vào một hàng để mở thống kê chi tiết.
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60">
                      <SortableHead sort={sortState} field="position" label="#" title="Vị trí" className="w-14 px-3" />
                      <SortableHead sort={sortState} field="teamName" label="Đội" title="Đội bóng" className="min-w-44 text-left!" />
                      <SortableHead sort={sortState} field="played" label="Tr" title="Số trận" className="w-10" />
                      <SortableHead sort={sortState} field="won" label="T" title="Thắng" className="w-10" />
                      <SortableHead sort={sortState} field="drawn" label="H" title="Hoà" className="w-10" />
                      <SortableHead sort={sortState} field="lost" label="B" title="Thua" className="w-10" />
                      <SortableHead sort={sortState} field="goalsFor" label="BT" title="Bàn thắng" className="hidden w-12 lg:table-cell" />
                      <SortableHead sort={sortState} field="goalsAgainst" label="BG" title="Bàn thua" className="hidden w-12 lg:table-cell" />
                      <SortableHead sort={sortState} field="goalDifference" label="HS" title="Hiệu số" className="w-14" />
                      <SortableHead sort={sortState} field="points" label="Điểm" title="Điểm" className="w-16 border-x border-slate-800 bg-slate-950/80 px-3 font-extrabold text-slate-100" />
                      <th scope="col" className="hidden w-32 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 xl:table-cell">
                        5 trận gần nhất
                      </th>
                      <th scope="col" className="hidden w-20 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 xl:table-cell">
                        Kế tiếp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {processedStandings.map((team) => {
                      const isExpanded = expandedTeamId === team.id;
                      return (
                        <React.Fragment key={team.id}>
                          <tr
                            onClick={() => toggleRow(team.id)}
                            onKeyDown={(e) => onRowKeyDown(e, team.id)}
                            tabIndex={0}
                            role="button"
                            aria-expanded={isExpanded}
                            className={`group cursor-pointer border-l-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/50 ${getQualificationStrip(team.position)} ${
                              isExpanded ? "bg-blue-600/10" : "hover:bg-slate-800/40"
                            }`}
                          >
                            <td className="px-3 py-2.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="w-5 text-sm font-extrabold text-slate-100">{team.position}</span>
                                {renderMovement(team.position, team.prevPosition)}
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 p-1 transition-transform group-hover:scale-105">
                                  <ClubCrest src={team.logoUrl} alt="" fallback={team.shortName} size="h-7 w-7" />
                                </div>
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-bold text-slate-100 transition-colors group-hover:text-cyan-200">
                                    {team.teamName}
                                  </div>
                                  <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                    {team.shortName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-2.5 text-center font-semibold text-slate-300">{team.played}</td>
                            <td className="px-2 py-2.5 text-center font-semibold text-slate-300">{team.won}</td>
                            <td className="px-2 py-2.5 text-center font-semibold text-slate-300">{team.drawn}</td>
                            <td className="px-2 py-2.5 text-center font-semibold text-slate-300">{team.lost}</td>
                            <td className="hidden px-2 py-2.5 text-center text-slate-400 lg:table-cell">{team.goalsFor}</td>
                            <td className="hidden px-2 py-2.5 text-center text-slate-400 lg:table-cell">{team.goalsAgainst}</td>
                            <td className="px-2 py-2.5 text-center font-bold">
                              <span
                                className={
                                  team.goalDifference > 0
                                    ? "text-emerald-400"
                                    : team.goalDifference < 0
                                      ? "text-rose-400"
                                      : "text-slate-400"
                                }
                              >
                                {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                              </span>
                            </td>
                            <td className="border-x border-slate-800 bg-slate-950/50 px-3 py-2.5 text-center text-sm font-extrabold text-white group-hover:bg-slate-950/80">
                              {team.points}
                            </td>
                            <td className="hidden px-3 py-2.5 xl:table-cell">
                              <div className="flex justify-center">{renderForm(team.form)}</div>
                            </td>
                            <td className="hidden px-3 py-2.5 text-center xl:table-cell">
                              {team.nextOpponent ? (
                                <span title={`Vòng tới gặp ${team.nextOpponent.name}`} className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-800 p-0.5 transition-colors group-hover:border-blue-500">
                                  <ClubCrest
                                    src={team.nextOpponent.logo}
                                    alt={team.nextOpponent.name}
                                    fallback={team.nextOpponent.name.slice(0, 3).toUpperCase()}
                                    size="h-5 w-5"
                                  />
                                </span>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-slate-950/40">
                              <td colSpan={12} className="px-4 py-4">
                                <TeamDetails team={team} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Xếp hạng dạng thẻ cho mobile */}
              <ul className="space-y-2 p-3 md:hidden">
                {processedStandings.map((team) => {
                  const isExpanded = expandedTeamId === team.id;
                  return (
                    <li
                      key={team.id}
                      className={`overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 border-l-[3px] ${getQualificationStrip(team.position)}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleRow(team.id)}
                        aria-expanded={isExpanded}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                      >
                        <span className="w-5 shrink-0 text-center text-sm font-extrabold text-slate-100">{team.position}</span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 p-1">
                          <ClubCrest src={team.logoUrl} alt="" fallback={team.shortName} size="h-6 w-6" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-slate-100">{team.teamName}</span>
                          <span className="mt-1 flex items-center gap-2">
                            {renderForm(team.form, true)}
                            <span className="shrink-0 text-[10px] text-slate-500">
                              {team.played} trận • HS {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-base font-extrabold leading-none text-white">{team.points}</span>
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">điểm</span>
                        </span>
                        {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" /> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />}
                      </button>
                      {isExpanded && (
                        <div className="border-t border-slate-800 px-3 py-3">
                          <TeamDetails team={team} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Chú giải */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/50 px-4 py-3 text-[11px] text-slate-400">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />Dự C1 ({league.zones.ucl} đội)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />Dự C2 ({league.zones.uel} đội)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-rose-600" />Xuống hạng
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />Bấm vào một đội để xem thống kê chi tiết
                </span>
              </div>
            </>
          )}
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Số liệu {league.name} mùa {currentSeason} do TinViaHe tổng hợp từ Sports Mole, Goal.com và Vavel; cập nhật tới 29/09/2026.
      </p>
    </section>
  );
}
