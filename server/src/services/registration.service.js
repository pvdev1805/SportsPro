import { USER_ROLES } from '../constants/user-roles.js'
import { Customer, Product, Registration } from '../models/index.js'
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../utils/app-error.js'

const resolveRegistrationCustomer = async ({ actorUserId, actorRole, requestedCustomerId }) => {
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

  throw new ForbiddenError('You do not have permission to register products')
}

const getCustomerRegistrations = async (customerId) => {
  const customer = await Customer.findByPk(customerId)

  if (!customer) {
    throw new NotFoundError(`Customer with ID "${customerId}" not found`)
  }

  const registrations = await Registration.findAll({
    where: {
      customerId
    },
    include: {
      model: Product,
      as: 'product'
    },
    order: [['registrationDate', 'DESC']]
  })

  return registrations
}

const createRegistration = async ({ actorUserId, actorRole, customerId, productCode }) => {
  const customer = await resolveRegistrationCustomer({
    actorUserId,
    actorRole,
    requestedCustomerId: customerId
  })

  const product = await Product.findByPk(productCode)

  if (!product) {
    throw new NotFoundError(`Product with code "${productCode}" not found`)
  }

  const existingRegistration = await Registration.findOne({
    where: {
      customerId: customer.customerId,
      productCode
    }
  })

  if (existingRegistration) {
    throw new ConflictError(`Product "${productCode}" is already registered to this customer`)
  }

  const registration = await Registration.create({
    customerId: customer.customerId,
    productCode,
    registrationDate: new Date()
  })

  return Registration.findOne({
    where: {
      customerId: registration.customerId,
      productCode: registration.productCode
    },
    include: {
      model: Product,
      as: 'product'
    }
  })
}

const registrationService = {
  getCustomerRegistrations,
  createRegistration
}

export default registrationService
