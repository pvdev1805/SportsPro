import { PAGE_ROUTES } from '../constants/routes.js'

const ROLE_NAVIGATION = Object.freeze({
  admin: [
    {
      label: 'Home',
      href: PAGE_ROUTES.HOME
    },
    {
      label: 'Products',
      href: PAGE_ROUTES.PRODUCTS
    },
    {
      label: 'Customers',
      href: PAGE_ROUTES.CUSTOMERS
    },
    {
      label: 'Technicians',
      href: PAGE_ROUTES.TECHNICIANS
    },
    {
      label: 'Incidents',
      href: PAGE_ROUTES.INCIDENTS
    }
  ],

  technician: [
    {
      label: 'Home',
      href: PAGE_ROUTES.HOME
    },
    {
      label: 'Products',
      href: PAGE_ROUTES.PRODUCTS
    },
    {
      label: 'Assigned Incidents',
      href: PAGE_ROUTES.INCIDENTS
    }
  ],

  customer: [
    {
      label: 'Home',
      href: PAGE_ROUTES.HOME
    },
    {
      label: 'Products',
      href: PAGE_ROUTES.PRODUCTS
    },
    {
      label: 'Register Product',
      href: PAGE_ROUTES.REGISTER_PRODUCT
    },
    {
      label: 'My Incidents',
      href: PAGE_ROUTES.INCIDENTS
    }
  ]
})

export const getNavigationForRole = (role) => {
  return ROLE_NAVIGATION[role] ?? []
}
