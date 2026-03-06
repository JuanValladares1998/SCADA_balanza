interface ItemProps {
  h: number;
  w: number;
}

function UpsItem({ h, w }: ItemProps) {
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
      aria-label="Icono UPS"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6" />
      <path d="M9 12h6" />
      <path d="M9 15h3" />
      <path d="M15 14l2-3h-2l1-2" />
    </svg>
  );
}

export default UpsItem;
