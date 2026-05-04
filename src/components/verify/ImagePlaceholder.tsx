export function ImagePlaceholder() {
  return (
    <div className="mb-4 rounded-xl border border-slate-800 bg-black/40 p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60">
        <svg
          className="h-5 w-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="-0 -3 22 22"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4h14v10H4z M7 7h8 M7 10h5"
          />
        </svg>
      </div>

      <p className="text-sm font-medium text-slate-200">
        Imagen no proporcionada por la marca
      </p>

      <p className="mt-1 text-xs text-slate-500">
        La verificación se determina por el registro digital, no por la imagen.
      </p>
    </div>
  );
}