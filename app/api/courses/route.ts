import { NextRequest, NextResponse } from 'next/server'
import { getDb, initDB } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initDB()
    const db = getDb()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'date_added'
    const order = (searchParams.get('order') || 'desc').toUpperCase()

    let query = 'SELECT * FROM courses WHERE 1=1'
    const args: (string | number | null)[] = []

    if (status) {
      query += ' AND status = ?'
      args.push(status)
    }
    if (category) {
      query += ' AND category = ?'
      args.push(category)
    }
    if (priority) {
      query += ' AND priority = ?'
      args.push(priority)
    }
    if (search) {
      query += ' AND title LIKE ?'
      args.push(`%${search}%`)
    }

    const safeOrder = order === 'ASC' ? 'ASC' : 'DESC'
    if (sort === 'priority') {
      query += ` ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END ${safeOrder}`
    } else {
      const safeSort = ['date_added', 'estimated_hours', 'title'].includes(sort) ? sort : 'date_added'
      query += ` ORDER BY ${safeSort} ${safeOrder}`
    }

    const result = await db.execute({ sql: query, args })
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('[GET /api/courses]', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB()
    const db = getDb()
    const body = await request.json()
    const { title, provider, url, category, status, notes, priority, estimated_hours } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const result = await db.execute({
      sql: `INSERT INTO courses (title, provider, url, category, status, notes, priority, estimated_hours)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        title.trim(),
        provider || '',
        url || '',
        category || '',
        status || 'parked',
        notes || '',
        priority || 'medium',
        estimated_hours != null ? Number(estimated_hours) : null,
      ],
    })

    const newRow = await db.execute({
      sql: 'SELECT * FROM courses WHERE id = ?',
      args: [Number(result.lastInsertRowid)],
    })

    return NextResponse.json(newRow.rows[0], { status: 201 })
  } catch (error) {
    console.error('[POST /api/courses]', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
