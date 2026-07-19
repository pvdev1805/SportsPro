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
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    tableName: 'technicians'
  }
)

export default Technician
