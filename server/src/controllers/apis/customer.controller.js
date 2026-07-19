import customerService from '../../services/customer.service.js'

// GET /api/customers
export const getAllCustomers = async (req, res) => {
  const customers = await customerService.getAllCustomers()

  res.status(200).json({
    success: true,
    data: customers
  })
}

// GET /api/customers/search?lastName=...
export const searchCustomers = async (req, res) => {
  const { lastName = '' } = req.query

  const customers = await customerService.searchCustomersByLastName(lastName.trim())

  res.status(200).json({
    success: true,
    data: customers
  })
}

// GET /api/customers/:customerId
export const getCustomerById = async (req, res) => {
  const { customerId } = req.params

  const customer = await customerService.getCustomerById(customerId)

  res.status(200).json({
    success: true,
    data: customer
  })
}

// PUT /api/customers/:customerId
export const updateCustomer = async (req, res) => {
  const { customerId } = req.params

  const customerData = req.body

  const customer = await customerService.updateCustomer(customerId, customerData)

  res.status(200).json({
    success: true,
    message: 'Customer updated successfully',
    data: customer
  })
}

// POST /api/customers/login
export const loginCustomer = async (req, res) => {
  const { email = '' } = req.body

  const customer = await customerService.loginCustomer(email.trim())

  res.status(200).json({
    success: true,
    message: 'Customer login successful',
    data: customer
  })
}
