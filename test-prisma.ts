import { PrismaClient } from '@prisma/client'
import { createClient } from '@libsql/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
console.log('Database path:', dbPath)

const libsql = createClient({
  url: `file://${dbPath}`
})
console.log('LibSQL client created')

const adapter = new PrismaLibSql(libsql)
console.log('Adapter created')

const prisma = new PrismaClient({
  adapter,
})
console.log('Prisma client created')

async function test() {
  const count = await prisma.user.count()
  console.log('User count:', count)
}

test().finally(() => prisma.$disconnect())
