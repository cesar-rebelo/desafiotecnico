import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

let prisma = null;

try {
  if (process.env.DATABASE_URL) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    console.warn("DATABASE_URL não configurada no ambiente.");
  }
} catch (err) {
  console.error("Erro ao inicializar Prisma Client:", err.message);
}

export default prisma;
