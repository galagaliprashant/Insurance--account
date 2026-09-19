"use client";

import { useMemo, useState } from "react";
import { demoHousehold, demoProtectionItems } from "@/data/demo-data";
import { ProtectionCard } from "@/components/ProtectionCard";
import { ProtectionType, SourceType } from "@/lib/domain";

const TYPES: (ProtectionType | "ALL")[] = ["ALL", "LIFE", "ACCIDENT", "HEALTH", "CRITICAL_ILLNESS", "DISABILITY"];
const SOURCES: (SourceType | "ALL")[] = [
  "ALL",
  "INDIVIDUAL_POLICY",
  "EMPLOYER_GROUP_COVER",
  "CREDIT_CARD_BENEFIT",
  "PMJJBY",
  "PMSBY",
  "ESI",
  "BANK_LINKED",
];

function personName(personId: string): string {
  return demoHousehold.members.find((m) => m.id === personId)?.name ?? "Unknown";
}

export default function ProtectionsPage() {
  const [type, setType] = useState<(typeof TYPES)[number]>("ALL");
  const [source, setSource] = useState<(typeof SOURCES)[number]>("ALL");

  const filtered = useMemo(
    () =>
      demoProtectionItems.filter(
        (item) => (type === "ALL" || item.type === type) && (source === "ALL" || item.sourceType === source)
      ),
    [type, source]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Protection Inventory</h1>
        <p className="text-sm text-slate-500">Filter by type and source. Open an item for evidence, nominee and claim route.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Type</label>
          <select
            className="mt-1 block rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as (typeof TYPES)[number])}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Source</label>
          <select
            className="mt-1 block rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
            value={source}
            onChange={(e) => setSource(e.target.value as (typeof SOURCES)[number])}
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <ProtectionCard key={item.id} item={item} personName={personName(item.personId)} />
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-500">No protection items match this filter.</p>}
      </div>
    </div>
  );
}
