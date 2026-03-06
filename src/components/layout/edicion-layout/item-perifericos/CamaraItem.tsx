interface ItemProps {
  h: number;
  w: number;
}

function CamaraItem({ h, w }: ItemProps) {
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
      aria-label="Icono camara"
    >
      <path d="M4 8h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" />
      <path d="M9 8l1.2-2h3.6L15 8" />
      <circle cx="12" cy="13.5" r="3" />
    </svg>
  );
}

export default CamaraItem;
