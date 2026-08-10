import { USER_ROLES } from '../constants/user-roles.js'
import { Customer, Incident, Technician } from '../models/index.js'
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/app-error.js'

const authorizeIncidentAccess = async (req, res, next) => {
  try {
    const incidentId = req.validated?.params?.incidentId ?? Number(req.params.incidentId)

    if (!Number.isInteger(incidentId) || incidentId <= 0) {
      throw new BadRequestError('Invalid incident ID')
    }

    const incident = await Incident.findByPk(incidentId)

    if (!incident) {
      throw new NotFoundError(`Incident with ID "${incidentId}" not found`)
    }

    if (req.user.role === USER_ROLES.ADMIN) {
      return next()
    }

    if (req.user.role === USER_ROLES.TECHNICIAN) {
      const technician = await Technician.findOne({
        where: {
          userId: req.user.userId
        }
      })

      if (!technician) {
        throw new NotFoundError('Technician profile was not found')
      }

      if (incident.techId !== technician.techId) {
        throw new ForbiddenError('You do not have permission to access this incident')
      }

      return next()
    }

    if (req.user.role === USER_ROLES.CUSTOMER) {
      const customer = await Customer.findOne({
        where: {
          userId: req.user.userId
        }
      })

      if (!customer) {
        throw new NotFoundError('Customer profile was not found')
      }

      if (incident.customerId !== customer.customerId) {
        throw new ForbiddenError('You do not have permission to access this incident')
      }

      return next()
    }

    throw new ForbiddenError('You do not have permission to access this incident')
  } catch (error) {
    next(error)
  }
}

export default authorizeIncidentAccess
