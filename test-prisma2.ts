import { PrismaClient } from '@prisma/client'
import { createClient } from '@libsql/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
console.log('Database path:', dbPath)

const libsql = createClient({
  url: `file://${dbPath}`
})

const adapter = new PrismaLibSql(libsql)

// Try without any options besides adapter
const prisma = new PrismaClient({ adapter })

async function test() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Query result:', result)
  } catch (e: any) {
    console.error('Error:', e.message)
    console.error('Code:', e.code)
  }
}

test().finally(() => prisma.$disconnect())
