import { demoEmergencyGrants, demoHousehold, demoProtectionItems } from "@/data/demo-data";
import { isConfirmed, needsAttention } from "@/lib/protection-logic";
import { VerificationBadge } from "@/components/VerificationBadge";

const AUDIT_LOG = [
  { id: "a1", actor: "Priya Mehta", action: "Viewed emergency summary", timestamp: "2026-09-10T18:22:00Z" },
  { id: "a2", actor: "Arjun Mehta", action: "Authorized Priya Mehta for LIFE, HEALTH, CRITICAL_ILLNESS", timestamp: "2025-11-01T00:00:00Z" },
];

export default function EmergencyPage() {
  const grant = demoEmergencyGrants[0];
  const authorizedPerson = demoHousehold.members.find((m) => m.id === grant.authorizedPersonId);
  const authorizedItems = demoProtectionItems.filter((item) => grant.scope.includes(item.type));
  const verified = authorizedItems.filter(isConfirmed);
  const potentiallyClaimable = authorizedItems.filter(needsAttention);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Emergency Mode shows only explicitly authorized information. {authorizedPerson?.name} is currently authorized to view{" "}
        {grant.scope.map((t) => t.replace(/_/g, " ").toLowerCase()).join(", ")} protection until{" "}
        {new Date(grant.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}.
      </div>

      <section>
        <h2 className="text-sm font-semibold text-ink">Verified — can be acted on now</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {verified.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{item.productName}</p>
                  <p className="text-xs text-slate-500">{item.provider}</p>
                </div>
                <VerificationBadge state={item.verification.state} />
              </div>
              {item.nominee && <p className="mt-2 text-xs text-slate-600">Nominee: {item.nominee.personName} ({item.nominee.relationship})</p>}
              {item.claimRoute && (
                <div className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
                  <p className="font-medium">Claim: {item.claimRoute.provider} · {item.claimRoute.contact}</p>
                  <p className="mt-1">{item.claimRoute.requiredDocuments.join(", ")}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-ink">Potentially claimable — needs verification first</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {potentiallyClaimable.length === 0 && <p className="text-sm text-slate-500">Nothing in this category.</p>}
          {potentiallyClaimable.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-ink">{item.productName}</p>
                <VerificationBadge state={item.verification.state} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{item.verification.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-ink">Access audit log</h2>
        <ul className="mt-3 space-y-2">
          {AUDIT_LOG.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-2 text-sm">
              <span className="text-slate-700">{entry.actor} — {entry.action}</span>
              <span className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
