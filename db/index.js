require('dotenv').config()

const { Pool } = require('pg')

const postgresConfig = {
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
  };

const { host, database, port, user, password } = postgresConfig;

const pool = new Pool({
  host,
  user,
  password,
  database,
  port,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}