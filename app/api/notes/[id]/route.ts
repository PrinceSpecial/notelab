import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { notes } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Handle GET request
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;

  try {
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    // Perform the query
    const note = await db
      .select()
      .from(notes)
      .where(eq(notes.id, id))
      .limit(1)
      .then((result) => result[0]);

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const body = await req.json()
    console.log(body)
    const { content, title } = body

    if (!content && !title) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    body.updatedAt = new Date()
    const result = await db.update(notes).set(body).where(eq(notes.id, id)).returning()
    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error('PATCH /api/notes/[id] error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
