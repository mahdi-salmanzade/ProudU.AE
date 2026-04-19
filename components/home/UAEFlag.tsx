type Props = {
  className?: string;
  ariaLabel?: string;
};

export function UAEFlag({
  className,
  ariaLabel = "Flag of the United Arab Emirates",
}: Props) {
  return (
    <svg
      viewBox="0 0 200 100"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <rect x="0" y="0" width="50" height="100" fill="#EF3340" />
      <rect x="50" y="0" width="150" height="33.333" fill="#00843D" />
      <rect x="50" y="33.333" width="150" height="33.334" fill="#FFFFFF" />
      <rect x="50" y="66.667" width="150" height="33.333" fill="#000000" />
    </svg>
  );
}
