import 'dotenv/config'

import app from './app.js'
import { testDatabaseConnection } from './config/database.js'

const port = process.env.PORT || 3000

const startServer = async () => {
  try {
    const databaseConnection = await testDatabaseConnection()
    console.log(`✅ Authenticated to PostgreSQL database "${databaseConnection.database_name}" successfully!`)

    if (!databaseConnection.schema_exists) {
      throw new Error(`Database schema "${process.env.DB_SCHEMA}" does NOT exist!`)
    }

    console.log(`✅ Connected to PostgreSQL database "${databaseConnection.database_name}" successfully!`)

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Failed to start the server:', error.message)
    process.exit(1)
  }
}

startServer()
