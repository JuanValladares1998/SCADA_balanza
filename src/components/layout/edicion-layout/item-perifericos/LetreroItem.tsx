interface ItemProps {
  h: number;
  w: number;
  colorClass?: string;
}

function LetreroItem({ h, w, colorClass = "text-current" }: ItemProps) {
  return (
    <svg
      className={colorClass}
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Icono letrero LED"
    >
      <rect x="2" y="7" width="20" height="10" rx="1" />
      <path d="M6 12h12" strokeWidth="3" strokeLinecap="square" strokeDasharray="1 3" />
      <path d="M4 17v2" />
      <path d="M20 17v2" />
    </svg>
  );
}

export default LetreroItem;
