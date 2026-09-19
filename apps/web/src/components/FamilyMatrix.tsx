import { Person, ProtectionItem, ProtectionType } from "@/lib/domain";
import { VerificationBadge } from "./VerificationBadge";

const PROTECTION_TYPES: ProtectionType[] = ["LIFE", "ACCIDENT", "HEALTH", "CRITICAL_ILLNESS", "DISABILITY"];

export function FamilyMatrix({ members, items }: { members: Person[]; items: ProtectionItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Family member</th>
            {PROTECTION_TYPES.map((type) => (
              <th key={type} className="px-4 py-3 text-left font-medium text-slate-500">
                {type.replace("_", " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {members.map((person) => (
            <tr key={person.id}>
              <td className="whitespace-nowrap px-4 py-3">
                <p className="font-medium text-ink">{person.name}</p>
                <p className="text-xs text-slate-400">{person.relationship.replace("_", " ")}</p>
              </td>
              {PROTECTION_TYPES.map((type) => {
                const match = items.find((item) => item.personId === person.id && item.type === type);
                return (
                  <td key={type} className="px-4 py-3">
                    {match ? (
                      <VerificationBadge state={match.verification.state} />
                    ) : (
                      <VerificationBadge state="NOT_DETECTED" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
