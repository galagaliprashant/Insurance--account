import { NextRequest, NextResponse } from "next/server";
import { demoDocuments } from "@/data/demo-data";

/** GET /api/documents — list demo documents (support endpoint for the Documents screen) */
export function GET() {
  return NextResponse.json({ documents: demoDocuments });
}

/** POST /api/documents — Document upload (PRD 8.1). Demo: accepts metadata only, simulates OCR intake. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.fileName !== "string" || typeof body.type !== "string") {
    return NextResponse.json({ error: "fileName and type are required" }, { status: 400 });
  }
  return NextResponse.json(
    {
      id: `doc_${Date.now()}`,
      fileName: body.fileName,
      type: body.type,
      uploadedAt: new Date().toISOString(),
      status: "PROCESSING",
    },
    { status: 201 }
  );
}
