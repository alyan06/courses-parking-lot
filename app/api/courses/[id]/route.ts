import { NextRequest, NextResponse } from 'next/server'
import { getDb, initDB } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDB()
    const db = getDb()
    const { id } = await params
    const result = await db.execute({
      sql: 'SELECT * FROM courses WHERE id = ?',
      args: [id],
    })
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('[GET /api/courses/:id]', error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDB()
    const db = getDb()
    const { id } = await params
    const body = await request.json()
    const {
      title, provider, url, category, status, notes,
      priority, estimated_hours, date_started, date_completed,
    } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    await db.execute({
      sql: `UPDATE courses SET
              title = ?, provider = ?, url = ?, category = ?,
              status = ?, notes = ?, priority = ?, estimated_hours = ?,
              date_started = ?, date_completed = ?
            WHERE id = ?`,
      args: [
        title.trim(),
        provider || '',
        url || '',
        category || '',
        status || 'parked',
        notes || '',
        priority || 'medium',
        estimated_hours != null ? Number(estimated_hours) : null,
        date_started || null,
        date_completed || null,
        id,
      ],
    })

    const updated = await db.execute({
      sql: 'SELECT * FROM courses WHERE id = ?',
      args: [id],
    })
    return NextResponse.json(updated.rows[0])
  } catch (error) {
    console.error('[PUT /api/courses/:id]', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDB()
    const db = getDb()
    const { id } = await params
    await db.execute({
      sql: 'DELETE FROM courses WHERE id = ?',
      args: [id],
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/courses/:id]', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
