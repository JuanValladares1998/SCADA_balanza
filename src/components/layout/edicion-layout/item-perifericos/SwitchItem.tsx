interface ItemProps {
  h: number;
  w: number;
  colorClass?: string;
}

function SwitchItem({ h, w, colorClass = "text-current" }: ItemProps) {
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
      aria-label="Icono switch de red"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="6" cy="12" r="1" fill="currentColor" />
      <circle cx="10" cy="12" r="1" fill="currentColor" />
      <circle cx="14" cy="12" r="1" fill="currentColor" />
      <path d="M18 10v4" />
      <path d="M20 10v4" />
    </svg>
  );
}

export default SwitchItem;
