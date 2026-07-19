import { Op } from 'sequelize'
import { Country, Customer } from '../models/index.js'
import { NotFoundError, UnauthorizedError } from '../utils/app-error.js'

const getAllCustomers = async () => {
  const customers = await Customer.findAll({
    include: {
      model: Country,
      as: 'country'
    },
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC']
    ]
  })

  return customers
}

const searchCustomersByLastName = async (lastName) => {
  const customers = await Customer.findAll({
    where: {
      lastName: {
        [Op.iLike]: `%${lastName}%`
      }
    },
    include: {
      model: Country,
      as: 'country'
    },
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC']
    ]
  })

  return customers
}

const getCustomerById = async (customerId) => {
  const customer = await Customer.findByPk(customerId, {
    include: {
      model: Country,
      as: 'country'
    }
  })

  if (!customer) {
    throw new NotFoundError(`Customer with ID "${customerId}" not found`)
  }

  return customer
}

const updateCustomer = async (customerId, customerData) => {
  const customer = await getCustomerById(customerId)

  const updateData = {
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    address: customerData.address,
    city: customerData.city,
    state: customerData.state,
    postalCode: customerData.postalCode,
    countryCode: customerData.countryCode,
    phone: customerData.phone,
    email: customerData.email
  }

  if (customerData.password) {
    updateData.password = customerData.password
  }

  await customer.update(updateData)

  return customer
}

const loginCustomer = async (email) => {
  const customer = await Customer.findOne({
    where: { email }
  })

  if (!customer) {
    throw new UnauthorizedError(`Customer with email "${email}" is not registered`)
  }

  return customer
}

const customerService = {
  getAllCustomers,
  searchCustomersByLastName,
  getCustomerById,
  updateCustomer,
  loginCustomer
}

export default customerService
