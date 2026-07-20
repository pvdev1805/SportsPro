import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Product = sequelize.define(
  'Product',
  {
    productCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: 'product_code'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    version: {
      type: DataTypes.DECIMAL(18, 1),
      allowNull: false
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'release_date'
    }
  },
  {
    tableName: 'products'
  }
)

export default Product
