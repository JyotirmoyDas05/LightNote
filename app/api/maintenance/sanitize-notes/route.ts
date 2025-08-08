import { NextResponse } from "next/server";
import { sanitizeAllNotes } from "@/server/notes";

export async function POST() {
  const result = await sanitizeAllNotes()
  return NextResponse.json(result)
}
