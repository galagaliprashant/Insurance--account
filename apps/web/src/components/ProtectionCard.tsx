import Link from "next/link";
import { ProtectionItem } from "@/lib/domain";
import { VerificationBadge } from "./VerificationBadge";

function formatInr(amount: number): string {
  if (amount <= 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function ProtectionCard({ item, personName }: { item: ProtectionItem; personName?: string }) {
  return (
    <Link
      href={`/protections/${item.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-500 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.type.replace("_", " ")}</p>
          <h3 className="mt-0.5 text-sm font-semibold text-ink">{item.productName}</h3>
          <p className="text-xs text-slate-500">{item.provider}</p>
        </div>
        <VerificationBadge state={item.verification.state} />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-lg font-semibold text-ink">{formatInr(item.coverage.amountInr)}</p>
          {personName && <p className="text-xs text-slate-500">Covers {personName}</p>}
        </div>
        <p className="text-xs text-slate-400">
          Verified {new Date(item.lastVerifiedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
      </div>
    </Link>
  );
}
