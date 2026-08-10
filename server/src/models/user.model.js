import { DataTypes } from 'sequelize'

import sequelize from '../config/database.js'
import { USER_ROLE_VALUES } from '../constants/user-roles.js'

const User = sequelize.define(
  'User',
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'user_id'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase())
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [USER_ROLE_VALUES]
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    }
  },
  {
    tableName: 'users',
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['passwordHash'] }
    },
    scopes: {
      withPasswordHash: {
        attributes: ['userId', 'email', 'passwordHash', 'role', 'isActive', 'createdAt', 'updatedAt']
      }
    }
  }
)

export default User
