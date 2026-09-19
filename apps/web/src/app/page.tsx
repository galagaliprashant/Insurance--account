import { demoHousehold, demoProtectionItems } from "@/data/demo-data";
import { ProtectionType } from "@/lib/domain";
import {
  attentionNeededItems,
  emergencyReadiness,
  recentlyVerifiedItems,
  totalConfirmedCoverageInr,
} from "@/lib/protection-logic";
import { ProtectionCard } from "@/components/ProtectionCard";
import { FamilyMatrix } from "@/components/FamilyMatrix";
import { VerificationBadge } from "@/components/VerificationBadge";
import Link from "next/link";

const HERO_TYPES: ProtectionType[] = ["LIFE", "ACCIDENT", "HEALTH", "CRITICAL_ILLNESS", "DISABILITY"];

function formatInr(amount: number): string {
  if (amount <= 0) return "₹0";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0, notation: "compact" }).format(amount);
}

function personName(personId: string): string {
  return demoHousehold.members.find((m) => m.id === personId)?.name ?? "Unknown";
}

export default function DashboardPage() {
  const attention = attentionNeededItems(demoProtectionItems);
  const recent = recentlyVerifiedItems(demoProtectionItems, 365);
  const readiness = emergencyReadiness(demoProtectionItems);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-100">Household protection overview</p>
        <h1 className="mt-1 text-3xl font-bold">Know what protects you.</h1>
        <p className="mt-2 max-w-xl text-sm text-brand-100">
          If something happens tomorrow, here is what {demoHousehold.members[0].name}&apos;s family can actually identify, verify and claim.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-ink">Protection by category</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {HERO_TYPES.map((type) => {
            const total = totalConfirmedCoverageInr(demoProtectionItems, type);
            const count = demoProtectionItems.filter((i) => i.type === type).length;
            return (
              <div key={type} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{type.replace("_", " ")}</p>
                <p className="mt-1 text-xl font-semibold text-ink">{formatInr(total)}</p>
                <p className="text-xs text-slate-500">{count} source{count === 1 ? "" : "s"} tracked</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-ink">Emergency readiness</h2>
          <p className="mt-2 text-3xl font-bold text-ink">{readiness.score}%</p>
          <p className="text-xs text-slate-500">Based on {readiness.confirmedItemCount} confirmed protection item(s)</p>
          <ul className="mt-4 space-y-1 text-sm text-slate-600">
            <li>{readiness.hasNominee ? "✓" : "✗"} Nominee identified</li>
            <li>{readiness.hasClaimRoute ? "✓" : "✗"} Claim route documented</li>
          </ul>
          <Link href="/emergency" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline">
            Open Emergency Mode →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-ink">Attention needed</h2>
          <p className="text-xs text-slate-500">Evidence found, status not fully confirmed</p>
          <ul className="mt-3 space-y-3">
            {attention.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink">{item.productName}</p>
                  <p className="text-xs text-slate-500">{personName(item.personId)}</p>
                </div>
                <VerificationBadge state={item.verification.state} />
              </li>
            ))}
            {attention.length === 0 && <p className="text-sm text-slate-500">Nothing pending.</p>}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-ink">Recently verified</h2>
          <ul className="mt-3 space-y-3">
            {recent.slice(0, 4).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink">{item.productName}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.lastVerifiedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <VerificationBadge state={item.verification.state} showTooltip={false} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Family Protection Matrix</h2>
          <Link href="/family" className="text-sm font-medium text-brand-600 hover:underline">
            View family →
          </Link>
        </div>
        <div className="mt-3">
          <FamilyMatrix members={demoHousehold.members} items={demoProtectionItems} />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">All protection items</h2>
          <Link href="/protections" className="text-sm font-medium text-brand-600 hover:underline">
            Open inventory →
          </Link>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoProtectionItems.slice(0, 6).map((item) => (
            <ProtectionCard key={item.id} item={item} personName={personName(item.personId)} />
          ))}
        </div>
      </section>
    </div>
  );
}
