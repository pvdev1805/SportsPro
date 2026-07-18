import { Sequelize } from 'sequelize'

const requiredEnvironmentVariables = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_SCHEMA']

const missingVariable = requiredEnvironmentVariables.find((variable) => !process.env[variable])
if (missingVariable) {
  throw new Error(`Missing required environment variable: ${missingVariable}`)
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  define: {
    schema: process.env.DB_SCHEMA,
    timestamps: false,
    freezeTableName: true,
    underscored: true
  },
  logging: process.env.NODE_ENV === 'development' ? (message) => console.log(`[Sequelize] ${message}`) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

export const testDatabaseConnection = async () => {
  await sequelize.authenticate()

  const [results] = await sequelize.query(
    `
      SELECT
        current_database() AS database_name,
        EXISTS (
          SELECT 1
          FROM information_schema.schemata
          WHERE schema_name = :schema
        ) AS schema_exists
    `,
    {
      replacements: {
        schema: process.env.DB_SCHEMA
      }
    }
  )

  return results[0]
}

export default sequelize
