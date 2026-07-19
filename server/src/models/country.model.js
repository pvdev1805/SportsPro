import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Country = sequelize.define(
  'Country',
  {
    countryCode: {
      type: DataTypes.STRING(2),
      primaryKey: true,
      field: 'country_code'
    },
    countryName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'country_name'
    }
  },
  {
    tableName: 'countries'
  }
)

export default Country
