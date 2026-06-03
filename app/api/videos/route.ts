import { NextRequest, NextResponse } from 'next/server'
import { getDb, initDB } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initDB()
    const db = getDb()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const platform = searchParams.get('platform')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'date_added'
    const order = (searchParams.get('order') || 'desc').toUpperCase()

    let query = 'SELECT * FROM videos WHERE 1=1'
    const args: (string | number | null)[] = []

    if (status) {
      query += ' AND status = ?'
      args.push(status)
    }
    if (category) {
      query += ' AND category = ?'
      args.push(category)
    }
    if (platform) {
      query += ' AND platform = ?'
      args.push(platform)
    }
    if (tag) {
      query += ' AND (tags LIKE ? OR tags LIKE ? OR tags LIKE ? OR tags = ?)'
      args.push(`${tag},%`, `%,${tag},%`, `%,${tag}`, tag)
    }
    if (search) {
      query += ' AND title LIKE ?'
      args.push(`%${search}%`)
    }

    const safeOrder = order === 'ASC' ? 'ASC' : 'DESC'
    const safeSort = ['date_added', 'title', 'platform'].includes(sort) ? sort : 'date_added'
    query += ` ORDER BY ${safeSort} ${safeOrder}`

    const result = await db.execute({ sql: query, args })
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('[GET /api/videos]', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB()
    const db = getDb()
    const body = await request.json()
    const { title, source_url, platform, category, status, notes, tags } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const result = await db.execute({
      sql: `INSERT INTO videos (title, source_url, platform, category, status, notes, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        title.trim(),
        source_url || '',
        platform || 'Other',
        category || '',
        status || 'saved',
        notes || '',
        tags || '',
      ],
    })

    const newRow = await db.execute({
      sql: 'SELECT * FROM videos WHERE id = ?',
      args: [Number(result.lastInsertRowid)],
    })

    return NextResponse.json(newRow.rows[0], { status: 201 })
  } catch (error) {
    console.error('[POST /api/videos]', error)
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }
}
