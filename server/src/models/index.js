import Country from './country.model.js'
import Customer from './customer.model.js'
import Registration from './registration.model.js'
import Product from './product.model.js'

Customer.belongsTo(Country, {
  foreignKey: 'countryCode',
  targetKey: 'countryCode',
  as: 'country'
})

Country.hasMany(Customer, {
  foreignKey: 'countryCode',
  sourceKey: 'countryCode',
  as: 'customers'
})

Registration.belongsTo(Customer, {
  foreignKey: 'customerId',
  targetKey: 'customerId',
  as: 'customer'
})

Customer.hasMany(Registration, {
  foreignKey: 'customerId',
  sourceKey: 'customerId',
  as: 'registrations'
})

Registration.belongsTo(Product, {
  foreignKey: 'productCode',
  targetKey: 'productCode',
  as: 'product'
})

Product.hasMany(Registration, {
  foreignKey: 'productCode',
  sourceKey: 'productCode',
  as: 'registrations'
})

export { Country, Customer, Registration, Product }
