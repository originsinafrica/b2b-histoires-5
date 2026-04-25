import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

export function PriceChart({
  data,
  initial,
}: {
  data: { jour: string; valeur: number }[];
  initial: number;
}) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.78 0.14 70)" />
              <stop offset="100%" stopColor="oklch(0.65 0.16 50)" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="jour"
            tick={{ fontSize: 10, fill: "oklch(0.5 0.02 270)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "oklch(0.5 0.02 270)" }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid oklch(0.92 0.008 90)",
              fontSize: 12,
              background: "white",
              boxShadow: "0 8px 24px -8px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ color: "oklch(0.5 0.02 270)" }}
            formatter={(v) => [`${v} Noix`, "Cours"]}
          />
          <ReferenceLine
            y={initial}
            stroke="oklch(0.5 0.02 270)"
            strokeDasharray="3 3"
            label={{ value: "Entrée", fontSize: 10, fill: "oklch(0.5 0.02 270)", position: "right" }}
          />
          <Line
            type="monotone"
            dataKey="valeur"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
