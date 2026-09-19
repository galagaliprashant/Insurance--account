/**
 * Protection Graph domain types.
 * Mirrors PRD section 7 (Data Model) and section 6 (Evidence and Verification Engine).
 *
 * NOTE: lives under apps/web/src/lib for now; extract to packages/domain
 * once a second consumer (e.g. services/api) needs to share these types.
 */

export type VerificationState =
  | "VERIFIED"
  | "USER_CONFIRMED"
  | "NEEDS_VERIFICATION"
  | "UNKNOWN"
  | "NOT_DETECTED";

export const VERIFICATION_META: Record<
  VerificationState,
  { label: string; description: string; tone: string }
> = {
  VERIFIED: {
    label: "Verified",
    description: "Authoritative/current evidence supports the benefit.",
    tone: "verified",
  },
  USER_CONFIRMED: {
    label: "User confirmed",
    description: "User explicitly confirmed it; independent evidence incomplete.",
    tone: "userconfirmed",
  },
  NEEDS_VERIFICATION: {
    label: "Needs verification",
    description: "Evidence suggests a benefit but status/eligibility is incomplete.",
    tone: "needsverification",
  },
  UNKNOWN: {
    label: "Unknown",
    description: "Insufficient evidence to conclude.",
    tone: "unknown",
  },
  NOT_DETECTED: {
    label: "Not detected",
    description: "No evidence found in available sources; not proof of absence.",
    tone: "notdetected",
  },
};

export type ProtectionType =
  | "LIFE"
  | "ACCIDENT"
  | "HEALTH"
  | "CRITICAL_ILLNESS"
  | "DISABILITY";

export type SourceType =
  | "INDIVIDUAL_POLICY"
  | "EMPLOYER_GROUP_COVER"
  | "CREDIT_CARD_BENEFIT"
  | "PMJJBY"
  | "PMSBY"
  | "ESI"
  | "BANK_LINKED";

export interface Person {
  id: string;
  name: string;
  relationship: "SELF" | "SPOUSE" | "CHILD" | "PARENT" | "DEPENDANT";
  dateOfBirth?: string;
}

export interface Household {
  id: string;
  ownerId: string;
  members: Person[];
}

export interface Evidence {
  id: string;
  source: string;
  document?: string;
  extractedFields: Record<string, string | number>;
  hash: string;
  timestamp: string;
}

export interface Nominee {
  personName: string;
  relationship: string;
  evidenceState: VerificationState;
}

export interface ClaimRoute {
  provider: string;
  contact: string;
  requiredDocuments: string[];
}

export interface Coverage {
  amountInr: number;
  conditions: string[];
}

export interface Verification {
  state: VerificationState;
  reason: string;
  verifier: "SYSTEM" | "USER" | "DOCUMENT_OCR";
  timestamp: string;
}

export interface ProtectionItem {
  id: string;
  personId: string;
  type: ProtectionType;
  sourceType: SourceType;
  productName: string;
  provider: string;
  maskedPolicyNumber?: string;
  coverage: Coverage;
  nominee?: Nominee;
  claimRoute?: ClaimRoute;
  evidence: Evidence[];
  verification: Verification;
  lastVerifiedAt: string;
}

export interface EmergencyAccessGrant {
  id: string;
  authorizedPersonId: string;
  scope: ProtectionType[];
  expiresAt: string;
  grantedAt: string;
}

export interface DemoDocument {
  id: string;
  fileName: string;
  type: "POLICY_PDF" | "EMPLOYER_BENEFITS_PDF" | "BANK_STATEMENT";
  uploadedAt: string;
  linkedProtectionId?: string;
  status: "PROCESSED" | "PROCESSING" | "NEEDS_REVIEW";
}
