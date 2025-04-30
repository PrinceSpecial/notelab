import { NextResponse } from "next/server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const allNotes = await db.query.notes.findMany();
  return NextResponse.json(allNotes);
}

export async function POST(req: Request) {
  const body = await req.json()
  console.log(body)
  const { title, tags, userId, lastUpdatedBy } = body

  if (!title) {
    return NextResponse.json({ error: 'Titre requis' }, { status: 400 })
  }

  const result = await db.insert(notes).values({
    id: uuidv4(),
    title,
    tags,
    content: '', // default empty
    userId,
    lastUpdatedBy,
  }).returning()
  const noteId = result[0].id

  return NextResponse.json({ id: noteId })
}
