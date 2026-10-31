export function AzulejoPadrao({ id, className }: { id: string; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M14 1 27 14 14 27 1 14Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="14" cy="14" r="2.2" fill="currentColor" />
          <circle cx="0" cy="0" r="2" fill="currentColor" />
          <circle cx="28" cy="28" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function Azulejo({ id = "azulejo" }: { id?: string }) {
  return (
    <div className="azulejo-band" aria-hidden="true">
      <AzulejoPadrao id={id} />
    </div>
  );
}
