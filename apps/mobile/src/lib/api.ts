import * as secureStorage from "./secure-storage";
import { DiscoveryResult, ProtectionType, Ticket } from "@protection-passport/domain";

// Defaults to the deployed demo backend so the app works out of the box in
// Expo Go; override with EXPO_PUBLIC_API_BASE_URL for local development
// against `cd apps/web && npm run dev`.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://protection-passport.vercel.app";

const TOKEN_KEY = "pp_session_token";

export async function getToken(): Promise<string | null> {
  return secureStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await secureStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await secureStorage.deleteItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, authed = true): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (authed) {
    const token = await getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, body?.error ?? "Something went wrong. Please try again.");
  }
  return body as T;
}

/* ---------------- auth ---------------- */

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; phone: string };
}

export function signup(input: { name: string; phone: string; password: string }) {
  return request<AuthResponse>("/api/auth/signup", { method: "POST", body: JSON.stringify(input) }, false);
}

export function login(input: { phone: string; password: string }) {
  return request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(input) }, false);
}

/* ---------------- cases ---------------- */

export interface DeceasedDetailsInput {
  deceasedName: string;
  deceasedDob: string;
  dateOfDemise: string;
  relationshipToClaimant: "SPOUSE" | "CHILD" | "PARENT" | "SIBLING" | "OTHER";
}

export function createCase(input: DeceasedDetailsInput) {
  return request<{ caseId: string; status: string }>("/api/cases", { method: "POST", body: JSON.stringify(input) });
}

/* ---------------- kyc ---------------- */

export function submitAadhaar(caseId: string, aadhaarNumber: string) {
  return request<{ kycId: string; otpSent: boolean; maskedAadhaar: string; demoOtp: string }>(
    "/api/kyc/aadhaar",
    { method: "POST", body: JSON.stringify({ caseId, aadhaarNumber }) }
  );
}

export function verifyAadhaarOtp(caseId: string, otp: string) {
  return request<{ aadhaarVerified: boolean }>("/api/kyc/aadhaar/verify-otp", {
    method: "POST",
    body: JSON.stringify({ caseId, otp }),
  });
}

export function submitPan(caseId: string, panNumber: string) {
  return request<{ panVerified: boolean; maskedPan: string }>("/api/kyc/pan", {
    method: "POST",
    body: JSON.stringify({ caseId, panNumber }),
  });
}

/* ---------------- discovery ---------------- */

export function runDiscovery(caseId: string) {
  return request<{ discoveryId: string; status: string }>("/api/discovery/run", {
    method: "POST",
    body: JSON.stringify({ caseId }),
  });
}

export function getDiscovery(discoveryId: string) {
  return request<DiscoveryResult>(`/api/discovery/${discoveryId}`, { method: "GET" });
}

/* ---------------- tickets ---------------- */

export function raiseTicket(input: { caseId: string; missingItemType: ProtectionType | "OTHER"; description: string }) {
  return request<{ ticketId: string; ticketNumber: string; status: string }>("/api/tickets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getTicket(ticketNumber: string) {
  return request<Ticket>(`/api/tickets/${ticketNumber}`, { method: "GET" });
}
