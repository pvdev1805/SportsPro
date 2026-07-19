import { Customer, Product, Registration } from '../models/index.js'
import { ConflictError, NotFoundError } from '../utils/app-error.js'

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

const createRegistration = async (customerId, productCode) => {
  const customer = await Customer.findByPk(customerId)

  if (!customer) {
    throw new NotFoundError(`Customer with ID "${customerId}" not found`)
  }

  const product = await Product.findByPk(productCode)

  if (!product) {
    throw new NotFoundError(`Product with code "${productCode}" not found`)
  }

  const existingRegistration = await Registration.findOne({
    where: {
      customerId,
      productCode
    }
  })

  if (existingRegistration) {
    throw new ConflictError(`Product "${productCode}" is already registered to this customer`)
  }

  const registration = await Registration.create({
    customerId,
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
