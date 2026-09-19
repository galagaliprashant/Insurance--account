import { demoHousehold, demoProtectionItems } from "@/data/demo-data";
import { emergencyReadiness } from "@/lib/protection-logic";
import { FamilyMatrix } from "@/components/FamilyMatrix";
import { VerificationBadge } from "@/components/VerificationBadge";

export default function FamilyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-ink">Family</h1>
        <p className="text-sm text-slate-500">Primary user, spouse, children and authorized dependants.</p>
      </div>

      <FamilyMatrix members={demoHousehold.members} items={demoProtectionItems} />

      <div className="grid gap-4 sm:grid-cols-2">
        {demoHousehold.members.map((person) => {
          const items = demoProtectionItems.filter((i) => i.personId === person.id);
          const readiness = emergencyReadiness(items);
          return (
            <div key={person.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-ink">{person.name}</h2>
                  <p className="text-xs text-slate-500">{person.relationship.replace("_", " ")}</p>
                </div>
                <span className="text-sm font-semibold text-ink">{readiness.score}% ready</span>
              </div>
              <ul className="mt-3 space-y-2">
                {items.length === 0 && <li className="text-sm text-slate-500">No protection items linked yet.</li>}
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.productName}</span>
                    <VerificationBadge state={item.verification.state} showTooltip={false} />
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Nominee readiness: {readiness.hasNominee ? "identified" : "not yet identified"} · Emergency authorization:{" "}
                {person.relationship === "SPOUSE" ? "granted" : "not granted"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
