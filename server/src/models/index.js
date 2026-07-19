import Country from './country.model.js'
import Customer from './customer.model.js'

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

export { Country, Customer }
