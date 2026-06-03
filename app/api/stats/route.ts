import { NextResponse } from 'next/server'
import { getDb, initDB } from '@/lib/db'

export async function GET() {
  try {
    await initDB()
    const db = getDb()

    const [courseStats, videoStats] = await Promise.all([
      db.execute(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'parked'      THEN 1 ELSE 0 END) as parked,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'done'        THEN 1 ELSE 0 END) as done
        FROM courses
      `),
      db.execute(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'saved'   THEN 1 ELSE 0 END) as saved,
          SUM(CASE WHEN status = 'watched' THEN 1 ELSE 0 END) as watched
        FROM videos
      `),
    ])

    const cs = courseStats.rows[0]
    const vs = videoStats.rows[0]

    return NextResponse.json({
      total_courses: Number(cs?.total ?? 0),
      total_parked: Number(cs?.parked ?? 0),
      total_in_progress: Number(cs?.in_progress ?? 0),
      total_done: Number(cs?.done ?? 0),
      total_videos: Number(vs?.total ?? 0),
      total_saved: Number(vs?.saved ?? 0),
      total_watched: Number(vs?.watched ?? 0),
    })
  } catch (error) {
    console.error('[GET /api/stats]', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
