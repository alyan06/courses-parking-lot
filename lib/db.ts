import { createClient, type Client } from '@libsql/client'

let client: Client | null = null
let initialized = false

export function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL ?? 'file:dev.db'
    const authToken = process.env.TURSO_AUTH_TOKEN
    client = createClient({
      url,
      ...(authToken ? { authToken } : {}),
    })
  }
  return client
}

export async function initDB(): Promise<void> {
  if (initialized) return
  const db = getDb()

  await db.execute(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      provider TEXT DEFAULT '',
      url TEXT DEFAULT '',
      category TEXT DEFAULT '',
      status TEXT DEFAULT 'parked',
      notes TEXT DEFAULT '',
      date_added TEXT DEFAULT (datetime('now')),
      date_started TEXT,
      date_completed TEXT,
      priority TEXT DEFAULT 'medium',
      estimated_hours REAL
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      source_url TEXT DEFAULT '',
      platform TEXT DEFAULT 'Other',
      category TEXT DEFAULT '',
      status TEXT DEFAULT 'saved',
      notes TEXT DEFAULT '',
      date_added TEXT DEFAULT (datetime('now')),
      date_watched TEXT,
      tags TEXT DEFAULT ''
    )
  `)

  const courseCount = await db.execute('SELECT COUNT(*) as cnt FROM courses')
  const videoCount = await db.execute('SELECT COUNT(*) as cnt FROM videos')

  if (Number(courseCount.rows[0]?.cnt ?? 0) === 0) {
    await db.batch(
      [
        {
          sql: `INSERT INTO courses (title, provider, url, category, status, notes, priority, estimated_hours)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            'Complete Web Development Bootcamp',
            'Udemy',
            'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
            'CS',
            'in_progress',
            'Covers full-stack from scratch. Great exercises.',
            'high',
            65,
          ],
        },
        {
          sql: `INSERT INTO courses (title, provider, url, category, status, notes, priority, estimated_hours)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            'Machine Learning Specialization',
            'Coursera',
            'https://www.coursera.org/specializations/machine-learning-introduction',
            'AI',
            'parked',
            'Andrew Ng — priority after finishing web dev.',
            'high',
            90,
          ],
        },
        {
          sql: `INSERT INTO courses (title, provider, url, category, status, notes, priority, estimated_hours)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            'CSS for JavaScript Developers',
            'Josh Comeau',
            'https://css-for-js.dev/',
            'Design',
            'done',
            'The best CSS course out there. Completely changed how I think about layout.',
            'medium',
            40,
          ],
        },
      ],
      'write'
    )
  }

  if (Number(videoCount.rows[0]?.cnt ?? 0) === 0) {
    await db.batch(
      [
        {
          sql: `INSERT INTO videos (title, source_url, platform, category, status, notes, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            'How to Learn Anything Fast — Josh Kaufman',
            'https://www.youtube.com/watch?v=5MgBikgcWnY',
            'YouTube',
            'Productivity',
            'saved',
            'The first 20 hours principle. Bookmark for whenever I start a new skill.',
            'learning,productivity,meta-skills',
          ],
        },
        {
          sql: `INSERT INTO videos (title, source_url, platform, category, status, notes, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            'System Design Interview: Top 10 Concepts',
            'https://www.youtube.com/watch?v=i53Gi_K3o7I',
            'YouTube',
            'CS',
            'watched',
            'Great overview of distributed systems concepts. Watch before any system design interview.',
            'system-design,interviews,architecture',
          ],
        },
        {
          sql: `INSERT INTO videos (title, source_url, platform, category, status, notes, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            '10 TypeScript Tricks You Need to Know',
            'https://www.youtube.com/watch?v=zQnBQ4tB3ZA',
            'YouTube',
            'CS',
            'saved',
            'Saw this shared on Instagram, looks super practical.',
            'typescript,tips,programming',
          ],
        },
      ],
      'write'
    )
  }

  initialized = true
}
