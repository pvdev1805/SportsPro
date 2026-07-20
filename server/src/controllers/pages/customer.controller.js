import countryService from '../../services/country.service.js'
import customerService from '../../services/customer.service.js'

// // GET /customers
// export const renderCustomerPage = async (req, res) => {
//   const customers = await customerService.getAllCustomers()

//   res.render('pages/customers', {
//     title: 'Manage Customers',
//     customers
//   })
// }

// GET /customers
export const renderCustomerPage = (req, res) => {
  res.render('pages/customers', {
    title: 'Manage Customers'
  })
}

// GET /customers/:customerId/edit
export const renderCustomerEditPage = async (req, res) => {
  const { customerId } = req.params
  const customer = await customerService.getCustomerById(customerId)
  const countries = await countryService.getAllCountries()

  res.render('pages/customer-edit', {
    title: 'Edit Customer',
    customer,
    countries
  })
}
