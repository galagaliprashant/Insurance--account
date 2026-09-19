"use client";

import { useState } from "react";
import { demoDocuments } from "@/data/demo-data";
import { DemoDocument } from "@/lib/domain";

const STATUS_CLASSES: Record<DemoDocument["status"], string> = {
  PROCESSED: "bg-green-50 text-green-800 ring-green-600/20",
  PROCESSING: "bg-sky-50 text-sky-800 ring-sky-600/20",
  NEEDS_REVIEW: "bg-amber-50 text-amber-800 ring-amber-600/20",
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DemoDocument[]>(demoDocuments);
  const [uploadType, setUploadType] = useState<DemoDocument["type"]>("POLICY_PDF");

  function simulateUpload(fileName: string) {
    const doc: DemoDocument = {
      id: `doc_${Date.now()}`,
      fileName,
      type: uploadType,
      uploadedAt: new Date().toISOString(),
      status: "PROCESSING",
    };
    setDocuments((prev) => [doc, ...prev]);
    window.setTimeout(() => {
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: "NEEDS_REVIEW" } : d)));
    }, 1200);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-ink">Documents</h1>
        <p className="text-sm text-slate-500">Upload policy PDFs, employer benefit PDFs, or bank/card statements. Manual entry is also supported.</p>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <select
          className="mb-3 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value as DemoDocument["type"])}
        >
          <option value="POLICY_PDF">Policy PDF</option>
          <option value="EMPLOYER_BENEFITS_PDF">Employer benefits PDF</option>
          <option value="BANK_STATEMENT">Bank/card statement</option>
        </select>
        <p className="text-sm text-slate-500">Drop a file here or</p>
        <label className="mt-2 inline-block cursor-pointer rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Choose file (simulated — nothing leaves your browser)
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) simulateUpload(file.name);
              e.target.value = "";
            }}
          />
        </label>
        <p className="mt-3 text-xs text-slate-400">We never request bank passwords, card PINs, CVVs or OTPs.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-500">File</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Type</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Uploaded</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-4 py-3 font-medium text-ink">{doc.fileName}</td>
                <td className="px-4 py-3 text-slate-600">{doc.type.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(doc.uploadedAt).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_CLASSES[doc.status]}`}>
                    {doc.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
