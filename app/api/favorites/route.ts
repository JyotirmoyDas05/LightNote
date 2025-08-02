import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { favorites } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { noteId } = await req.json();
    if (!noteId) {
      return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
    }
    // Prevent duplicate favorites
    const userId = session.user.id;
    const existing = await db.select().from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.noteId, noteId)));
    if (existing.length > 0) {
      return NextResponse.json({ error: "Already favorited" }, { status: 409 });
    }
    const favorite = await db.insert(favorites).values({
      userId,
      noteId,
    }).returning();
    return NextResponse.json({ favorite: favorite[0] });
  } catch (error) {
    console.error("Error in /api/favorites POST:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const { noteId } = await req.json();
  if (!noteId) {
    return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
  }
  await db.delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.noteId, noteId)));
  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const session = await auth.api.getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  // Join notes table to get note title and emoji
  const favs = await db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
    with: {
      note: true,
    },
  });
  return NextResponse.json({ favorites: favs });
}
