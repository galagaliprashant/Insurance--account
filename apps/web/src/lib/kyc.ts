/**
 * DEMO-MODE identity verification helpers.
 *
 * No real UIDAI/NSDL call is made anywhere in this file. Aadhaar and PAN
 * are format-validated only, and the "OTP" is generated and returned by
 * our own server (shown on-screen) rather than delivered by an SMS
 * gateway or UIDAI. A production build swaps this module for a licensed
 * AUA/KUA (Aadhaar eKYC) and NSDL/Protean (PAN) integration behind the
 * same function signatures — see docs/claim-assist-architecture.md.
 */

const AADHAAR_RE = /^[2-9]\d{11}$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function isValidAadhaarFormat(value: string): boolean {
  return AADHAAR_RE.test(value.replace(/\s+/g, ""));
}

export function isValidPanFormat(value: string): boolean {
  return PAN_RE.test(value.trim().toUpperCase());
}

export function maskAadhaar(value: string): string {
  const digits = value.replace(/\s+/g, "");
  return `XXXX-XXXX-${digits.slice(-4)}`;
}

export function maskPan(value: string): string {
  const upper = value.trim().toUpperCase();
  return `${upper.slice(0, 2)}XXXXX${upper.slice(-2)}`;
}

/** Returns a 6-digit demo OTP. Shown directly in the API response — see module note above. */
export function generateDemoOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
