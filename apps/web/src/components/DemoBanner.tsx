import { DEMO_LABEL } from "@/data/demo-data";

export function DemoBanner() {
  return (
    <div className="bg-amber-50 py-1.5 text-center text-xs font-medium text-amber-800">
      {DEMO_LABEL} — no live bank, card or Account Aggregator integration in this build.
    </div>
  );
}
