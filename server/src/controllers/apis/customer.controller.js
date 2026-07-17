const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Customer API has not been implemented yet'
  })
}

export const getAllCustomers = notImplemented
export const searchCustomers = notImplemented
export const getCustomerById = notImplemented
export const updateCustomer = notImplemented
export const loginCustomer = notImplemented
