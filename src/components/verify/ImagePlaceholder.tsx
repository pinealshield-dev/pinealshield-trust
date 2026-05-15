export function ImagePlaceholder() {
  return (
    <div className="mb-5 rounded-2xl border border-slate-800 bg-black/30 px-6 py-10 text-center">

      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-black">
        <svg
          className="h-5 w-5 text-slate-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 5h16v14H4z"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h8"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 14h5"
          />
        </svg>
      </div>

      <p className="text-sm font-medium tracking-wide text-slate-300">
        Representación visual restringida
      </p>

      <p className="mt-2 max-w-sm mx-auto text-xs leading-relaxed text-slate-500">
        Este registro mantiene validación institucional activa sin exposición pública de representación visual asociada.
      </p>

    </div>
  );
}