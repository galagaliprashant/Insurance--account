import { Household, ProtectionItem, DemoDocument, EmergencyAccessGrant } from "@/lib/domain";

/**
 * DEMO DATA — deterministic, fictional. No real bank/AA integration.
 * All values below are illustrative only (PRD section 17).
 */
export const DEMO_LABEL = "DEMO DATA · fictional values";

export const demoHousehold: Household = {
  id: "hh_1",
  ownerId: "p_self",
  members: [
    { id: "p_self", name: "Arjun Mehta", relationship: "SELF", dateOfBirth: "1990-04-12" },
    { id: "p_spouse", name: "Priya Mehta", relationship: "SPOUSE", dateOfBirth: "1992-08-03" },
    { id: "p_child", name: "Vihaan Mehta", relationship: "CHILD", dateOfBirth: "2019-01-20" },
    { id: "p_parent", name: "Rajesh Mehta", relationship: "PARENT", dateOfBirth: "1962-11-02" },
  ],
};

export const demoProtectionItems: ProtectionItem[] = [
  {
    id: "prot_life_lic",
    personId: "p_self",
    type: "LIFE",
    sourceType: "INDIVIDUAL_POLICY",
    productName: "Jeevan Anand",
    provider: "LIC of India",
    maskedPolicyNumber: "LIC-••••-4471",
    coverage: { amountInr: 5000000, conditions: ["Sum assured payable on death", "Maturity benefit at term end"] },
    nominee: { personName: "Priya Mehta", relationship: "Spouse", evidenceState: "VERIFIED" },
    claimRoute: {
      provider: "LIC of India",
      contact: "1800-227-717 / nearest LIC branch",
      requiredDocuments: ["Original policy bond", "Death certificate", "Nominee ID + bank proof"],
    },
    evidence: [
      {
        id: "ev_1",
        source: "Uploaded policy PDF",
        document: "lic-jeevan-anand-2021.pdf",
        extractedFields: { sumAssured: 5000000, policyStart: "2021-06-15", premiumMode: "Annual" },
        hash: "sha256:demo-a1b2c3",
        timestamp: "2025-11-02T09:15:00Z",
      },
    ],
    verification: {
      state: "VERIFIED",
      reason: "Policy PDF matched insurer schema; sum assured and nominee extracted with high confidence.",
      verifier: "DOCUMENT_OCR",
      timestamp: "2025-11-02T09:16:00Z",
    },
    lastVerifiedAt: "2025-11-02T09:16:00Z",
  },
  {
    id: "prot_health_group",
    personId: "p_self",
    type: "HEALTH",
    sourceType: "EMPLOYER_GROUP_COVER",
    productName: "Group Mediclaim Policy",
    provider: "Star Health (via employer)",
    maskedPolicyNumber: "GMC-••••-9021",
    coverage: { amountInr: 1000000, conditions: ["Family floater", "Covers self + spouse + 2 children", "Pre-existing conditions covered from day 1"] },
    nominee: { personName: "Priya Mehta", relationship: "Spouse", evidenceState: "USER_CONFIRMED" },
    claimRoute: {
      provider: "Star Health TPA desk",
      contact: "employer HR benefits portal",
      requiredDocuments: ["Employee ID", "Hospital bills", "Discharge summary"],
    },
    evidence: [
      {
        id: "ev_2",
        source: "Uploaded employer benefits PDF",
        document: "hr-benefits-fy25-26.pdf",
        extractedFields: { familyFloaterSum: 1000000, planYear: "2025-26" },
        hash: "sha256:demo-d4e5f6",
        timestamp: "2025-09-20T11:00:00Z",
      },
    ],
    verification: {
      state: "VERIFIED",
      reason: "Employer benefits PDF confirms current plan year and floater sum.",
      verifier: "DOCUMENT_OCR",
      timestamp: "2025-09-20T11:05:00Z",
    },
    lastVerifiedAt: "2025-09-20T11:05:00Z",
  },
  {
    id: "prot_accident_card",
    personId: "p_self",
    type: "ACCIDENT",
    sourceType: "CREDIT_CARD_BENEFIT",
    productName: "Complimentary Air Accident Cover",
    provider: "HDFC Bank Regalia Credit Card",
    maskedPolicyNumber: "CARD-••••-6120",
    coverage: { amountInr: 10000000, conditions: ["Applies only for air travel booked using this card", "Accidental death/permanent disability"] },
    evidence: [
      {
        id: "ev_3",
        source: "Uploaded card statement",
        document: "hdfc-regalia-statement-aug.pdf",
        extractedFields: { cardVariant: "Regalia", benefitMention: "Air Accident Cover up to 1 Crore" },
        hash: "sha256:demo-g7h8i9",
        timestamp: "2025-08-30T07:40:00Z",
      },
    ],
    verification: {
      state: "NEEDS_VERIFICATION",
      reason: "Card variant identified from statement, but current T&Cs for this benefit have not been independently re-confirmed.",
      verifier: "DOCUMENT_OCR",
      timestamp: "2025-08-30T07:42:00Z",
    },
    lastVerifiedAt: "2025-08-30T07:42:00Z",
  },
  {
    id: "prot_life_pmjjby",
    personId: "p_parent",
    type: "LIFE",
    sourceType: "PMJJBY",
    productName: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    provider: "Government of India / SBI",
    coverage: { amountInr: 200000, conditions: ["Auto-debit enrolment required", "Age 18-50 at entry, renewable to 55"] },
    evidence: [
      {
        id: "ev_4",
        source: "Bank statement debit reference",
        document: "sbi-savings-statement-jun.pdf",
        extractedFields: { debitNarration: "PMJJBY PREMIUM", amount: 436 },
        hash: "sha256:demo-j1k2l3",
        timestamp: "2025-06-05T05:00:00Z",
      },
    ],
    verification: {
      state: "NEEDS_VERIFICATION",
      reason: "Auto-debit narration found, but enrolment/status confirmation from bank has not been independently verified.",
      verifier: "SYSTEM",
      timestamp: "2025-06-05T05:00:00Z",
    },
    lastVerifiedAt: "2025-06-05T05:00:00Z",
  },
  {
    id: "prot_health_pmsby",
    personId: "p_parent",
    type: "ACCIDENT",
    sourceType: "PMSBY",
    productName: "Pradhan Mantri Suraksha Bima Yojana",
    provider: "Government of India",
    coverage: { amountInr: 200000, conditions: ["Accidental death/disability cover", "Requires active auto-debit consent"] },
    evidence: [],
    verification: {
      state: "UNKNOWN",
      reason: "No enrolment or debit evidence located in available sources yet.",
      verifier: "SYSTEM",
      timestamp: "2025-01-01T00:00:00Z",
    },
    lastVerifiedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "prot_disability_esi",
    personId: "p_self",
    type: "DISABILITY",
    sourceType: "ESI",
    productName: "Employees' State Insurance",
    provider: "ESIC",
    coverage: { amountInr: 0, conditions: ["Statutory/social medical protection", "Separate from private health insurance"] },
    evidence: [],
    verification: {
      state: "NOT_DETECTED",
      reason: "No ESI contribution evidence found in available sources. Not proof of absence.",
      verifier: "SYSTEM",
      timestamp: "2025-01-01T00:00:00Z",
    },
    lastVerifiedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "prot_critical_illness",
    personId: "p_spouse",
    type: "CRITICAL_ILLNESS",
    sourceType: "INDIVIDUAL_POLICY",
    productName: "Critical Illness Rider",
    provider: "HDFC Life Click2Protect",
    maskedPolicyNumber: "HDFCL-••••-3390",
    coverage: { amountInr: 1500000, conditions: ["Covers 20 critical illnesses", "Lump sum on diagnosis"] },
    nominee: { personName: "Arjun Mehta", relationship: "Spouse", evidenceState: "VERIFIED" },
    claimRoute: {
      provider: "HDFC Life",
      contact: "1860-267-9999",
      requiredDocuments: ["Policy document", "Diagnosis reports", "Doctor certification"],
    },
    evidence: [
      {
        id: "ev_5",
        source: "Uploaded policy PDF",
        document: "hdfclife-click2protect-2023.pdf",
        extractedFields: { riderSum: 1500000, illnessesCovered: 20 },
        hash: "sha256:demo-m4n5o6",
        timestamp: "2025-10-11T14:20:00Z",
      },
    ],
    verification: {
      state: "VERIFIED",
      reason: "Rider schedule matched insurer template; nominee cross-checked with base policy.",
      verifier: "DOCUMENT_OCR",
      timestamp: "2025-10-11T14:22:00Z",
    },
    lastVerifiedAt: "2025-10-11T14:22:00Z",
  },
];

export const demoDocuments: DemoDocument[] = [
  { id: "doc_1", fileName: "lic-jeevan-anand-2021.pdf", type: "POLICY_PDF", uploadedAt: "2025-11-02T09:14:00Z", linkedProtectionId: "prot_life_lic", status: "PROCESSED" },
  { id: "doc_2", fileName: "hr-benefits-fy25-26.pdf", type: "EMPLOYER_BENEFITS_PDF", uploadedAt: "2025-09-20T10:58:00Z", linkedProtectionId: "prot_health_group", status: "PROCESSED" },
  { id: "doc_3", fileName: "hdfc-regalia-statement-aug.pdf", type: "BANK_STATEMENT", uploadedAt: "2025-08-30T07:38:00Z", linkedProtectionId: "prot_accident_card", status: "NEEDS_REVIEW" },
  { id: "doc_4", fileName: "hdfclife-click2protect-2023.pdf", type: "POLICY_PDF", uploadedAt: "2025-10-11T14:18:00Z", linkedProtectionId: "prot_critical_illness", status: "PROCESSED" },
];

export const demoEmergencyGrants: EmergencyAccessGrant[] = [
  {
    id: "grant_1",
    authorizedPersonId: "p_spouse",
    scope: ["LIFE", "HEALTH", "CRITICAL_ILLNESS"],
    grantedAt: "2025-11-01T00:00:00Z",
    expiresAt: "2026-11-01T00:00:00Z",
  },
];

export function getProtectionsForPerson(personId: string): ProtectionItem[] {
  return demoProtectionItems.filter((item) => item.personId === personId);
}

export function getProtectionById(id: string): ProtectionItem | undefined {
  return demoProtectionItems.find((item) => item.id === id);
}
