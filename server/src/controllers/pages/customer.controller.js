// GET /customers
export const renderCustomerPage = (req, res) => {
  return res.render('pages/customers', {
    title: 'Manage Customers'
  })
}

// GET /customers/:customerId/edit
export const renderCustomerEditPage = (req, res) => {
  return res.render('pages/customer-edit', {
    title: 'Edit Customer'
  })
}
