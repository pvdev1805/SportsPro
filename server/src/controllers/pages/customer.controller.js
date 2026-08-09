import countryService from '../../services/country.service.js'
import customerService from '../../services/customer.service.js'

// GET /customers
export const renderCustomerPage = (req, res) => {
  return res.render('pages/customers', {
    title: 'Manage Customers'
  })
}

// GET /customers/:customerId/edit
export const renderCustomerEditPage = async (req, res) => {
  const { customerId } = req.validated.params

  const customer = await customerService.getCustomerById(customerId)
  const countries = await countryService.getAllCountries()

  return res.render('pages/customer-edit', {
    title: 'Edit Customer',
    customer,
    countries
  })
}
