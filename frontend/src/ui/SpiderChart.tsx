import { useCallback, useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Cat } from "../types/Flash";
import type { JSX } from "react/jsx-runtime";

interface StatDatum {
  stat: string;
  value: number;
}
interface StatTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: StatDatum }>;
}

const ACCENT = "#22d3ee";
const GRID = "#1e293b";
const LABEL_MUTED = "#475569";

// Tooltip hiện chỉ số khi hover vào một đỉnh
function StatTooltip({ active, payload }: StatTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const { stat, value } = payload[0].payload as StatDatum;
  return (
    <div className="rounded-lg border border-cyan-500/30 bg-slate-900/95 px-3 py-1.5 shadow-lg shadow-black/40">
      <p className="text-[10px] text-slate-400">{stat}</p>
      <p className="font-mono text-sm font-semibold tabular-nums text-cyan-300">
        {value}
      </p>
    </div>
  );
}

// Đỉnh của đa giác, phồng lên + có quầng sáng khi hover
function StatDot({ cx, cy, payload, active }: any) {
  const isActive = active === payload.stat;
  return (
    <g key={`dot-${payload.stat}`}>
      {isActive && (
        <circle cx={cx} cy={cy} r={9} fill={ACCENT} fillOpacity={0.2} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={isActive ? 4.5 : 3}
        fill="#0f172a"
        stroke={ACCENT}
        strokeWidth={isActive ? 2.5 : 1.5}
      />
    </g>
  );
}

// Vòng chỉ số overall nằm giữa đa giác, dạng thang đo tròn
function OverallReadout({ value }: { value: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), 100);
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-1560px]">
        <svg viewBox="0 0 60 60" className="h-100 w-100 -rotate-90">
          <circle cx="30" cy="30" r={radius} fill="none" stroke={GRID} strokeWidth={0.5} />
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke={ACCENT}
            strokeWidth={0.5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-base font-semibold leading-none tabular-nums text-cyan-300">
            {value}
          </span>
          <span className="mt-1 text-[9px] leading-none text-cyan-200">
            overall
          </span>
        </div>
      </div>
    </div>
  );
}

function CatStatRadar({ cat }: { cat: Cat }): JSX.Element | null {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  // Tự động chuyển object stats thành mảng data cho recharts
  const data: StatDatum[] = useMemo(() => {
    if (!cat.stats) return [];
    return Object.entries(cat.stats).map(([key, value]) => ({
      stat: key,
      value: Number(value) || 0,
    }));
  }, [cat.stats]);

  // Overall = trung bình cộng các chỉ số, làm tròn
  const overall = useMemo(() => {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return Math.round(total / data.length);
  }, [data]);

  const renderStatDot = useCallback(
    (props: any) => <StatDot {...props} active={hoveredStat} />,
    [hoveredStat]
  );

  if (data.length === 0) return null; 

  return (
    <div className="relative h-120 w-120 overflow-hidden border border-slate-800/80 bg-slate-950/60 p-2">
      {/* quầng sáng nền nhẹ cho có chiều sâu */}
      <div
        className="pointer-events-none absolute inset-0"
      />

      <span className="pointer-events-none absolute left-3 top-3 z-10 text-xs text-slate-400">
        {cat.name}
      </span>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          outerRadius="72%"
          onMouseMove={(state: any) => {
            const stat = state?.activePayload?.[0]?.payload?.stat;
            if (stat && stat !== hoveredStat) setHoveredStat(stat);
          }}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <defs>
            <radialGradient id="catStatFill" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.5} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0.1} />
            </radialGradient>
          </defs>
          <PolarGrid stroke={GRID} />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: LABEL_MUTED, fontSize: 9 }}
            axisLine={false}
            tickCount={5}
          />
          <Radar
            name={cat.name}
            dataKey="value"
            stroke={ACCENT}
            strokeWidth={2}
            fill="url(#catStatFill)"
            isAnimationActive={false}
            dot={renderStatDot}
          />
          <Tooltip
            content={<StatTooltip />}
            cursor={false}
            wrapperStyle={{ zIndex: 50 }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <OverallReadout value={overall} />
    </div>
  );
}

export default CatStatRadar;