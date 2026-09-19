const SECTIONS = [
  {
    title: "Consent management",
    items: ["Document upload consent", "Account Aggregator consent (not yet connected)", "Family sharing consent"],
  },
  {
    title: "Family access",
    items: ["Priya Mehta — Emergency access (LIFE, HEALTH, CRITICAL_ILLNESS)", "Rajesh Mehta — No access granted"],
  },
  {
    title: "Documents",
    items: ["4 documents stored", "Encrypted at rest", "Raw-document retention minimized after extraction"],
  },
  {
    title: "Retention / deletion",
    items: ["Request data export", "Delete a single document", "Delete entire household record"],
  },
  {
    title: "Security",
    items: ["Passkey / OTP sign-in", "Active sessions", "Access & change audit log"],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-slate-500">Consent, family access, documents, retention, security. Demo — controls are illustrative.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <div key={section.title} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">{section.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="flex items-center justify-between gap-2">
                  <span>{item}</span>
                  <button className="text-xs font-medium text-brand-600 hover:underline">Manage</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <h2 className="text-sm font-semibold text-red-800">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700">Deleting your account removes your household record, documents and evidence permanently.</p>
        <button className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          Delete account
        </button>
      </div>
    </div>
  );
}
