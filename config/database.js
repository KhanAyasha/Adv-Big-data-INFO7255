import 'dotenv/config'

const { HOSTNAME, PORT, REDIS_PORT , REDIS_USER , REDIS_PASSWORD } = process.env

const dbConfig = {
  HOSTNAME,
  PORT,
  REDIS_PORT,
  REDIS_USER,
  REDIS_PASSWORD
}

export default dbConfig;