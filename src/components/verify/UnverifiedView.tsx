import { ErrorAutoBack } from "@/components/verify/ErrorAutoBack";

export function UnverifiedView() {
  return (
    <main className="mx-auto max-w-3xl p-6 text-slate-100">
      <div className="rounded-xl border border-slate-800 bg-black/40 p-6">
        <div className="mb-4 rounded-lg border border-slate-600/40 bg-slate-600/10 p-4">
          <p className="font-semibold text-slate-300">
            Certificado no verificable
          </p>
          <p className="mt-1 text-sm text-slate-400">
            El código ingresado no corresponde a un certificado activo o
            verificable en este momento.
          </p>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Esto no indica un fallo del sistema. Verifica el código o consulta con
          la entidad emisora.
        </p>

        <div className="mt-6">
          <a
            href="/verify"
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Verificar otro código
          </a>
        </div>

        <ErrorAutoBack />
      </div>
    </main>
  );
}
