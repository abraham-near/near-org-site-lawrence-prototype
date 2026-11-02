// Small disclosure chevron (decorative; the button carries aria-expanded).
export function Chevron({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
