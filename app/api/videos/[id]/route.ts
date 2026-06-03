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
      sql: 'SELECT * FROM videos WHERE id = ?',
      args: [id],
    })
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('[GET /api/videos/:id]', error)
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
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
    const { title, source_url, platform, category, status, notes, tags, date_watched } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    await db.execute({
      sql: `UPDATE videos SET
              title = ?, source_url = ?, platform = ?, category = ?,
              status = ?, notes = ?, tags = ?, date_watched = ?
            WHERE id = ?`,
      args: [
        title.trim(),
        source_url || '',
        platform || 'Other',
        category || '',
        status || 'saved',
        notes || '',
        tags || '',
        date_watched || null,
        id,
      ],
    })

    const updated = await db.execute({
      sql: 'SELECT * FROM videos WHERE id = ?',
      args: [id],
    })
    return NextResponse.json(updated.rows[0])
  } catch (error) {
    console.error('[PUT /api/videos/:id]', error)
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
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
      sql: 'DELETE FROM videos WHERE id = ?',
      args: [id],
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/videos/:id]', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
