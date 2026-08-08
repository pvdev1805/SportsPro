import { DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

const Technician = sequelize.define(
  'Technician',
  {
    techId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'tech_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'user_id'
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'last_name'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  },
  {
    tableName: 'technicians'
  }
)

export default Technician
