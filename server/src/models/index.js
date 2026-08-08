import Country from './country.model.js'
import Customer from './customer.model.js'
import Registration from './registration.model.js'
import Product from './product.model.js'
import User from './user.model.js'
import RefreshToken from './refresh-token.model.js'
import Technician from './technician.model.js'
import Administrator from './administrator.model.js'

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

User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  sourceKey: 'userId',
  as: 'refreshTokens'
})

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'userId',
  as: 'user'
})

User.hasOne(Customer, {
  foreignKey: 'userId',
  sourceKey: 'userId',
  as: 'customer'
})

Customer.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'userId',
  as: 'user'
})

User.hasOne(Technician, {
  foreignKey: 'userId',
  sourceKey: 'userId',
  as: 'technician'
})

Technician.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'userId',
  as: 'user'
})

User.hasOne(Administrator, {
  foreignKey: 'userId',
  sourceKey: 'userId',
  as: 'administrator'
})

Administrator.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'userId',
  as: 'user'
})

export { Country, Customer, Registration, Product, User, RefreshToken, Technician, Administrator }
