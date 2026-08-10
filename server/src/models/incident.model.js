import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { INCIDENT_STATUS, INCIDENT_STATUS_VALUES } from '../constants/incident-status.js'

const Incident = sequelize.define(
  'Incident',
  {
    incidentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'incident_id'
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'customer_id'
    },
    productCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'product_code'
    },
    techId: {
      type: DataTypes.INTEGER,
      field: 'tech_id'
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: INCIDENT_STATUS.OPEN,
      validate: {
        isIn: [INCIDENT_STATUS_VALUES]
      }
    },
    dateOpened: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'date_opened'
    },
    dateClosed: {
      type: DataTypes.DATE,
      field: 'date_closed'
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: 'incidents'
  }
)

export default Incident
