function SwitchItem() {
  return (
    <svg
      className="h-42 w-42"
      viewBox="0 0 64 64"
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
