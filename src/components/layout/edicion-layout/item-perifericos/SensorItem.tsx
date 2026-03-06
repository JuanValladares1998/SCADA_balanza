interface ItemProps {
  h: number;
  w: number;
}

function SensorItem({ h, w }: ItemProps) {
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
      aria-label="Icono sensor IR"
    >
      <path d="M4 7v10" />
      <path d="M20 7v10" />
      <path d="M7 12h10" strokeDasharray="2 2" />
      <path d="M11 9l3 3-3 3" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="20" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

export default SensorItem;
