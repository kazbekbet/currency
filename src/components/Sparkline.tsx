interface Props {
  values: number[];
  width?: number;
  height?: number;
}

export function Sparkline({ values, width = 72, height = 28 }: Props) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;

  // rate up = currency weakens = line goes down (y increases in SVG)
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2);
    const y = pad + ((v - min) / range) * (height - pad * 2);
    return [x, y] as [number, number];
  });

  const linePath = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');

  const lastPt = pts[pts.length - 1];
  const firstPt = pts[0];
  const areaPath = `${linePath} L${lastPt[0].toFixed(1)},${String(height)} L${firstPt[0].toFixed(1)},${String(height)} Z`;

  // rate went up = last > first = currency weakened = red
  const isWeak = values[values.length - 1] > values[0];
  const color = isWeak ? '#f87171' : '#4ade80';
  const fillColor = isWeak ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.12)';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', flexShrink: 0 }}
    >
      <path d={areaPath} fill={fillColor} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="2" fill={color} />
    </svg>
  );
}
