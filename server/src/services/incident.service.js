import sequelize from '../config/database.js'

import { INCIDENT_STATUS, INCIDENT_STATUS_VALUES } from '../constants/incident-status.js'
import { USER_ROLES } from '../constants/user-roles.js'
import { Customer, Incident, Product, Registration, Technician } from '../models/index.js'
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/app-error.js'

const incidentIncludes = [
  {
    model: Customer,
    as: 'customer'
  },
  {
    model: Product,
    as: 'product'
  },
  {
    model: Technician,
    as: 'technician'
  }
]

const INCIDENT_STATUS_TRANSITIONS = Object.freeze({
  [INCIDENT_STATUS.OPEN]: [],
  [INCIDENT_STATUS.ASSIGNED]: [INCIDENT_STATUS.IN_PROGRESS],
  [INCIDENT_STATUS.IN_PROGRESS]: [INCIDENT_STATUS.RESOLVED],
  [INCIDENT_STATUS.RESOLVED]: [INCIDENT_STATUS.CLOSED],
  [INCIDENT_STATUS.CLOSED]: []
})

const resolveIncidentCustomer = async ({ actorUserId, actorRole, requestedCustomerId }) => {
  if (actorRole === USER_ROLES.CUSTOMER) {
    const customer = await Customer.findOne({
      where: {
        userId: actorUserId
      }
    })

    if (!customer) {
      throw new NotFoundError('Customer profile was not found')
    }

    return customer
  }

  if (actorRole === USER_ROLES.ADMIN) {
    const customerId = Number(requestedCustomerId)

    if (!Number.isInteger(customerId) || customerId <= 0) {
      throw new BadRequestError('A valid customerId is required')
    }

    const customer = await Customer.findByPk(customerId)

    if (!customer) {
      throw new NotFoundError(`Customer with ID "${customerId}" not found`)
    }

    return customer
  }

  throw new ForbiddenError('You do not have permission to create incidents')
}

const validateStatusTransition = (currentStatus, newStatus) => {
  const allowedTransitions = INCIDENT_STATUS_TRANSITIONS[currentStatus] ?? []

  if (!allowedTransitions.includes(newStatus)) {
    throw new BadRequestError(`Cannot change incident status from "${currentStatus}" to "${newStatus}"`)
  }
}

const getAllIncidents = async () => {
  const incidents = await Incident.findAll({
    include: incidentIncludes,
    order: [['dateOpened', 'DESC']]
  })

  return incidents
}

const getAssignedIncidentsForUser = async (userId) => {
  const technician = await Technician.findOne({
    where: {
      userId
    }
  })

  if (!technician) {
    throw new NotFoundError('Technician profile was not found')
  }

  const incidents = await Incident.findAll({
    where: {
      techId: technician.techId
    },
    include: incidentIncludes,
    order: [['dateOpened', 'DESC']]
  })

  return incidents
}

const getCustomerIncidentsForUser = async (userId) => {
  const customer = await Customer.findOne({
    where: {
      userId
    }
  })

  if (!customer) {
    throw new NotFoundError('Customer profile was not found')
  }

  const incidents = await Incident.findAll({
    where: {
      customerId: customer.customerId
    },
    include: incidentIncludes,
    order: [['dateOpened', 'DESC']]
  })

  return incidents
}

const getIncidentById = async (incidentId, options = {}) => {
  const incident = await Incident.findByPk(incidentId, {
    include: incidentIncludes,
    ...options
  })

  if (!incident) {
    throw new NotFoundError(`Incident with ID "${incidentId}" not found`)
  }

  return incident
}

const createIncident = async ({ actorUserId, actorRole, customerId, productCode, title, description }) => {
  const customer = await resolveIncidentCustomer({
    actorUserId,
    actorRole,
    requestedCustomerId: customerId
  })

  if (!productCode) {
    throw new BadRequestError('Product code is required')
  }

  if (!title?.trim()) {
    throw new BadRequestError('Incident title is required')
  }

  if (!description?.trim()) {
    throw new BadRequestError('Incident description is required')
  }

  const product = await Product.findByPk(productCode)

  if (!product) {
    throw new NotFoundError(`Product with code "${productCode}" not found`)
  }

  const registration = await Registration.findOne({
    where: {
      customerId: customer.customerId,
      productCode
    }
  })

  if (!registration) {
    throw new ForbiddenError('This product is not registered to the customer')
  }

  const incident = await Incident.create({
    customerId: customer.customerId,
    productCode,
    techId: null,
    status: INCIDENT_STATUS.OPEN,
    title: title.trim(),
    description: description.trim(),
    dateClosed: null
  })

  return getIncidentById(incident.incidentId)
}

const assignTechnician = async (incidentId, techId) => {
  const parsedIncidentId = Number(incidentId)
  const parsedTechId = Number(techId)

  if (!Number.isInteger(parsedIncidentId) || parsedIncidentId <= 0) {
    throw new BadRequestError('Invalid incident ID')
  }

  if (!Number.isInteger(parsedTechId) || parsedTechId <= 0) {
    throw new BadRequestError('Invalid technician ID')
  }

  return sequelize.transaction(async (transaction) => {
    const incident = await Incident.findByPk(parsedIncidentId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    if (!incident) {
      throw new NotFoundError(`Incident with ID "${parsedIncidentId}" not found`)
    }

    const technician = await Technician.findByPk(parsedTechId, {
      transaction
    })

    if (!technician) {
      throw new NotFoundError(`Technician with ID "${parsedTechId}" not found`)
    }

    if (incident.status === INCIDENT_STATUS.RESOLVED || incident.status === INCIDENT_STATUS.CLOSED) {
      throw new BadRequestError('Resolved or closed incidents cannot be assigned')
    }

    await incident.update(
      {
        techId: technician.techId,
        status: INCIDENT_STATUS.ASSIGNED
      },
      {
        transaction
      }
    )

    return getIncidentById(incident.incidentId, {
      transaction
    })
  })
}

const updateIncident = async ({ incidentId, actorUserId, actorRole, productCode, title, description }) => {
  const parsedIncidentId = Number(incidentId)

  if (!Number.isInteger(parsedIncidentId) || parsedIncidentId <= 0) {
    throw new BadRequestError('Invalid incident ID')
  }

  return sequelize.transaction(async (transaction) => {
    const incident = await Incident.findByPk(parsedIncidentId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    if (!incident) {
      throw new NotFoundError(`Incident with ID "${parsedIncidentId}" not found`)
    }

    if (actorRole === USER_ROLES.CUSTOMER) {
      const customer = await Customer.findOne({
        where: {
          userId: actorUserId
        },
        transaction
      })

      if (!customer) {
        throw new NotFoundError('Customer profile was not found')
      }

      if (incident.customerId !== customer.customerId) {
        throw new ForbiddenError('You do not have permission to update this incident')
      }

      if (incident.status !== INCIDENT_STATUS.OPEN) {
        throw new ForbiddenError('Customers can only update open incidents')
      }
    }

    if (actorRole === USER_ROLES.TECHNICIAN) {
      const technician = await Technician.findOne({
        where: {
          userId: actorUserId
        },
        transaction
      })

      if (!technician) {
        throw new NotFoundError('Technician profile was not found')
      }

      if (incident.techId !== technician.techId) {
        throw new ForbiddenError('You do not have permission to update this incident')
      }
    }

    if (actorRole !== USER_ROLES.ADMIN && actorRole !== USER_ROLES.TECHNICIAN && actorRole !== USER_ROLES.CUSTOMER) {
      throw new ForbiddenError('You do not have permission to update incidents')
    }

    const updateData = {}

    if (productCode !== undefined) {
      const product = await Product.findByPk(productCode, {
        transaction
      })

      if (!product) {
        throw new NotFoundError(`Product with code "${productCode}" not found`)
      }

      const registration = await Registration.findOne({
        where: {
          customerId: incident.customerId,
          productCode
        },
        transaction
      })

      if (!registration) {
        throw new ForbiddenError('This product is not registered to the customer')
      }

      updateData.productCode = productCode
    }

    if (title !== undefined) {
      if (!title?.trim()) {
        throw new BadRequestError('Incident title cannot be empty')
      }

      updateData.title = title.trim()
    }

    if (description !== undefined) {
      if (!description?.trim()) {
        throw new BadRequestError('Incident description cannot be empty')
      }

      updateData.description = description.trim()
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError('No valid incident fields were provided for update')
    }

    await incident.update(updateData, {
      transaction
    })

    return getIncidentById(incident.incidentId, { transaction })
  })
}

const updateIncidentStatus = async ({ incidentId, actorUserId, actorRole, status }) => {
  const parsedIncidentId = Number(incidentId)

  if (!Number.isInteger(parsedIncidentId) || parsedIncidentId <= 0) {
    throw new BadRequestError('Invalid incident ID')
  }

  if (!INCIDENT_STATUS_VALUES.includes(status)) {
    throw new BadRequestError(`Invalid incident status "${status}"`)
  }

  return sequelize.transaction(async (transaction) => {
    const incident = await Incident.findByPk(parsedIncidentId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    if (!incident) {
      throw new NotFoundError(`Incident with ID "${parsedIncidentId}" not found`)
    }

    if (actorRole === USER_ROLES.CUSTOMER) {
      throw new ForbiddenError('Customers cannot update incident status')
    }

    if (actorRole === USER_ROLES.TECHNICIAN) {
      const technician = await Technician.findOne({
        where: {
          userId: actorUserId
        },
        transaction
      })

      if (!technician) {
        throw new NotFoundError('Technician profile was not found')
      }

      if (incident.techId !== technician.techId) {
        throw new ForbiddenError('You do not have permission to update this incident')
      }
    }

    if (actorRole !== USER_ROLES.ADMIN && actorRole !== USER_ROLES.TECHNICIAN) {
      throw new ForbiddenError('You do not have permission to update incident status')
    }

    validateStatusTransition(incident.status, status)

    const updateData = {
      status
    }

    if (status === INCIDENT_STATUS.CLOSED) {
      updateData.dateClosed = new Date()
    }

    await incident.update(updateData, {
      transaction
    })

    return getIncidentById(incident.incidentId, { transaction })
  })
}

const incidentService = {
  getAllIncidents,
  getAssignedIncidentsForUser,
  getCustomerIncidentsForUser,
  getIncidentById,
  createIncident,
  assignTechnician,
  updateIncident,
  updateIncidentStatus
}

export default incidentService
