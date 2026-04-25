type Props = {
  values: number[];
  width?: number;
  height?: number;
  positive?: boolean;
};

/**
 * Mini-courbe SVG sans dépendance pour visualiser la tendance récente
 * du cours d'un personnage à côté de chaque ligne du portfolio.
 */
export function Sparkline({ values, width = 80, height = 28, positive = true }: Props) {
  if (!values || values.length < 2) {
    return <div style={{ width, height }} className="opacity-30" />;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const stroke = positive ? "oklch(0.7 0.16 145)" : "oklch(0.62 0.24 27)";
  const fill = positive
    ? "oklch(0.7 0.16 145 / 0.15)"
    : "oklch(0.62 0.24 27 / 0.15)";

  // build closed area path
  const area = `M0,${height} L${points
    .split(" ")
    .join(" L")} L${width},${height} Z`;

  return (
    <svg width={width} height={height} className="block">
      <path d={area} fill={fill} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
