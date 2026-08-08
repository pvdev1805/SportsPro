import { Op } from 'sequelize'
import sequelize from '../config/database.js'
import { Country, Customer, User } from '../models/index.js'
import { NotFoundError } from '../utils/app-error.js'

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
  const customers = await Customer.findAll({
    include: customerIncludes,
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
    include: customerIncludes,
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC']
    ]
  })

  return customers
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

    const updateData = {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      postalCode: customerData.postalCode,
      countryCode: customerData.countryCode,
      phone: customerData.phone
    }

    await customer.update(updateData, { transaction })

    if (customerData.email) {
      await customer.user.update(
        {
          email: customerData.email
        },
        { transaction }
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
