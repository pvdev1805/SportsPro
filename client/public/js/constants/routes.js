export const PAGE_ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  TECHNICIANS: '/technicians',
  CUSTOMERS: '/customers',
  REGISTER_PRODUCT: '/register-product',
  INCIDENTS: '/incidents'
})

export const API_ROUTES = Object.freeze({
  AUTH: Object.freeze({
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout'
  }),
  PROFILE: '/api/profile',
  PRODUCTS: '/api/products',
  TECHNICIANS: '/api/technicians',
  CUSTOMERS: '/api/customers',
  REGISTRATIONS: '/api/registrations',
  INCIDENTS: '/api/incidents'
})
