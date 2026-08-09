import customerService from '../../services/customer.service.js'

// GET /api/customers
export const getAllCustomers = async (req, res) => {
  const customers = await customerService.getAllCustomers()

  return res.status(200).json({
    success: true,
    data: customers
  })
}

// GET /api/customers/search?lastName=...
export const searchCustomers = async (req, res) => {
  const { lastName } = req.validated.query

  const customers = await customerService.searchCustomersByLastName(lastName)

  return res.status(200).json({
    success: true,
    data: customers
  })
}

// GET /api/customers/:customerId
export const getCustomerById = async (req, res) => {
  const { customerId } = req.validated.params

  const customer = await customerService.getCustomerById(customerId)

  return res.status(200).json({
    success: true,
    data: customer
  })
}

// PATCH /api/customers/:customerId
export const updateCustomer = async (req, res) => {
  const { customerId } = req.validated.params

  const customer = await customerService.updateCustomer(customerId, req.validated.body)

  return res.status(200).json({
    success: true,
    message: 'Customer updated successfully',
    data: customer
  })
}
