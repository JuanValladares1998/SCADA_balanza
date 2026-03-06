interface ItemProps {
  h: number;
  w: number;
}

function BalanzaItem({ h, w }: ItemProps) {
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Icono de balanza"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <rect x="8" y="8" width="8" height="4" rx="1" />
      <path d="M12 12v2" />
      <path d="M8 16h8" />
      <path d="M6 19v1" />
      <path d="M18 19v1" />
    </svg>
  );
}

export default BalanzaItem;
