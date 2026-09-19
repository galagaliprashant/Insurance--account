import { VerificationState, VERIFICATION_META } from "@/lib/domain";

const TONE_CLASSES: Record<string, string> = {
  verified: "bg-green-50 text-green-800 ring-green-600/20",
  userconfirmed: "bg-sky-50 text-sky-800 ring-sky-600/20",
  needsverification: "bg-amber-50 text-amber-800 ring-amber-600/20",
  unknown: "bg-slate-100 text-slate-700 ring-slate-500/20",
  notdetected: "bg-slate-50 text-slate-500 ring-slate-400/20",
};

const DOT_CLASSES: Record<string, string> = {
  verified: "bg-green-600",
  userconfirmed: "bg-sky-600",
  needsverification: "bg-amber-600",
  unknown: "bg-slate-500",
  notdetected: "bg-slate-400",
};

export function VerificationBadge({ state, showTooltip = true }: { state: VerificationState; showTooltip?: boolean }) {
  const meta = VERIFICATION_META[state];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[meta.tone]}`}
      title={showTooltip ? meta.description : undefined}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[meta.tone]}`} />
      {meta.label}
    </span>
  );
}
