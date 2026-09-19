import { notFound } from "next/navigation";
import Link from "next/link";
import { getProtectionById, demoHousehold } from "@/data/demo-data";
import { EvidencePanel } from "@/components/EvidencePanel";

export default function ProtectionDetailPage({ params }: { params: { id: string } }) {
  const item = getProtectionById(params.id);
  if (!item) return notFound();

  const person = demoHousehold.members.find((m) => m.id === item.personId);

  return (
    <div className="space-y-6">
      <Link href="/protections" className="text-sm font-medium text-brand-600 hover:underline">
        ← Back to inventory
      </Link>
      {person && <p className="text-sm text-slate-500">Covers {person.name} ({person.relationship.replace("_", " ").toLowerCase()})</p>}
      <EvidencePanel item={item} />
    </div>
  );
}
