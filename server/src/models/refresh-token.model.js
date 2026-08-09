import { DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

const RefreshToken = sequelize.define(
  'RefreshToken',
  {
    refreshTokenId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'refresh_token_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    tokenHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'token_hash'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at'
    },
    revokedAt: {
      type: DataTypes.DATE,
      field: 'revoked_at'
    }
  },
  {
    tableName: 'refresh_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
)

export default RefreshToken
