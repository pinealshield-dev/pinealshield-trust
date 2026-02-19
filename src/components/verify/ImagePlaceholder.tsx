// app/verify/[hash]/ImagePlaceholder.tsx

export function ImagePlaceholder() {
  return (
    <div className="mb-4 rounded-xl border border-slate-800 bg-black/40 p-6 text-center">
      {/* Icono sello */}
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
        <svg
          className="h-5 w-5 text-emerald-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="-0 -3 22 22"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <p className="text-sm font-medium text-slate-200">
        Imagen no proporcionada por la marca
      </p>

      <p className="mt-1 text-xs text-slate-400">
        La autenticidad de este producto ha sido verificada digitalmente por Pineal Shield.
      </p>
    </div>
  );
}
