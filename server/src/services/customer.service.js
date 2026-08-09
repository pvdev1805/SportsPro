import { Op } from 'sequelize'

import sequelize from '../config/database.js'
import { Country, Customer, User } from '../models/index.js'
import { ConflictError, NotFoundError } from '../utils/app-error.js'

const customerIncludes = [
  {
    model: Country,
    as: 'country'
  },
  {
    model: User,
    as: 'user',
    attributes: ['userId', 'email']
  }
]

const getAllCustomers = async () => {
  return Customer.findAll({
    include: customerIncludes,
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC']
    ]
  })
}

const searchCustomersByLastName = async (lastName) => {
  return Customer.findAll({
    where: {
      lastName: {
        [Op.iLike]: `%${lastName}%`
      }
    },
    include: customerIncludes,
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC']
    ]
  })
}

const getCustomerById = async (customerId, options = {}) => {
  const customer = await Customer.findByPk(customerId, {
    include: customerIncludes,
    ...options
  })

  if (!customer) {
    throw new NotFoundError(`Customer with ID "${customerId}" not found`)
  }

  return customer
}

const updateCustomer = async (customerId, customerData) => {
  return sequelize.transaction(async (transaction) => {
    const customer = await getCustomerById(customerId, { transaction })

    const customerUpdateData = {}

    if (customerData.firstName !== undefined) {
      customerUpdateData.firstName = customerData.firstName
    }

    if (customerData.lastName !== undefined) {
      customerUpdateData.lastName = customerData.lastName
    }

    if (customerData.address !== undefined) {
      customerUpdateData.address = customerData.address
    }

    if (customerData.city !== undefined) {
      customerUpdateData.city = customerData.city
    }

    if (customerData.state !== undefined) {
      customerUpdateData.state = customerData.state
    }

    if (customerData.postalCode !== undefined) {
      customerUpdateData.postalCode = customerData.postalCode
    }

    if (customerData.countryCode !== undefined) {
      const country = await Country.findByPk(customerData.countryCode, { transaction })

      if (!country) {
        throw new NotFoundError(`Country with code "${customerData.countryCode}" not found`)
      }

      customerUpdateData.countryCode = customerData.countryCode
    }

    if (customerData.phone !== undefined) {
      customerUpdateData.phone = customerData.phone
    }

    if (Object.keys(customerUpdateData).length > 0) {
      await customer.update(customerUpdateData, { transaction })
    }

    if (customerData.email !== undefined) {
      const existingUser = await User.findOne({
        where: {
          email: customerData.email
        },
        transaction
      })

      if (existingUser && existingUser.userId !== customer.userId) {
        throw new ConflictError(`User with email "${customerData.email}" already exists`)
      }

      await customer.user.update(
        {
          email: customerData.email
        },
        {
          transaction
        }
      )
    }

    return getCustomerById(customerId, { transaction })
  })
}

const customerService = {
  getAllCustomers,
  searchCustomersByLastName,
  getCustomerById,
  updateCustomer
}

export default customerService
