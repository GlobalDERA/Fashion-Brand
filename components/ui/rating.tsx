export function Rating({ value }: { value: number }) {
  return (
    <span aria-label={`Rated ${value} out of 5`} className="text-sm font-semibold">
      ★ {value.toFixed(1)}
    </span>
  );
}
