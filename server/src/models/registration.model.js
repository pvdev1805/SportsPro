import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Registration = sequelize.define(
  'Registration',
  {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'customer_id'
    },
    productCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: 'product_code'
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'registration_date'
    }
  },
  {
    tableName: 'registrations'
  }
)

export default Registration
