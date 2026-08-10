import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Administrator = sequelize.define(
  'Administrator',
  {
    username: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'user_id'
    }
  },
  {
    tableName: 'administrators'
  }
)

export default Administrator
