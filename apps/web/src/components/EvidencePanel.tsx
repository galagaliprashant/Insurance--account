import { ProtectionItem } from "@/lib/domain";
import { VerificationBadge } from "./VerificationBadge";

function formatInr(amount: number): string {
  if (amount <= 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function EvidencePanel({ item }: { item: ProtectionItem }) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.type.replace("_", " ")} · {item.sourceType.replace(/_/g, " ")}</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">{item.productName}</h2>
            <p className="text-sm text-slate-500">{item.provider}{item.maskedPolicyNumber ? ` · ${item.maskedPolicyNumber}` : ""}</p>
          </div>
          <VerificationBadge state={item.verification.state} />
        </div>
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{item.verification.reason}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-ink">Coverage</h3>
        <p className="mt-2 text-2xl font-semibold text-ink">{formatInr(item.coverage.amountInr)}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
          {item.coverage.conditions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      {item.nominee && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-ink">Nominee</h3>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-slate-700">{item.nominee.personName} · {item.nominee.relationship}</p>
            <VerificationBadge state={item.nominee.evidenceState} />
          </div>
        </section>
      )}

      {item.claimRoute && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-ink">Claim route</h3>
          <p className="mt-2 text-sm text-slate-700">{item.claimRoute.provider} · {item.claimRoute.contact}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">Required documents</p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-slate-600">
            {item.claimRoute.requiredDocuments.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-ink">Evidence trail</h3>
        {item.evidence.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No supporting evidence uploaded yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {item.evidence.map((ev) => (
              <li key={ev.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                <p className="font-medium text-ink">{ev.source}</p>
                {ev.document && <p className="text-xs text-slate-500">{ev.document}</p>}
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(ev.timestamp).toLocaleString("en-IN")} · hash {ev.hash}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
