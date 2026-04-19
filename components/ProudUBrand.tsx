type Props = {
  className?: string;
};

export function ProudUBrand({ className }: Props) {
  return (
    <span className={className}>
      ProudU.<span className="text-[#EF3340]">A</span>
      <span className="text-[#00843D]">E</span>
    </span>
  );
}
