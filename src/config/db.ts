import { env } from './env'
import pg from 'pg'

const { Pool } = pg

export const db = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
})
