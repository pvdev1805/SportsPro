import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { showError } from './utils/notification.js'

const CURRENT_CUSTOMER_KEY = 'currentCustomer'

const loginTitle = document.querySelector('.customer-login-title')
const loginPanel = document.querySelector('.login-panel')
const registrationPanel = document.querySelector('.registration-panel')
const successPanel = document.querySelector('.success-panel')

const loginForm = document.querySelector('#customer-login-form')
const registrationForm = document.querySelector('#product-registration-form')
const registerAnotherButton = document.querySelector('#register-another-btn')
const logoutButton = document.querySelector('#logout-btn')

const emailInput = document.querySelector('#email')
const productSelect = document.querySelector('#productCode')
const customerNameElement = document.querySelector('.customer-name')
const successMessageElement = document.querySelector('.registration-success-message')

let currentCustomer = null

const showPanel = (panel) => {
  panel.classList.remove('hidden')
}

const hidePanel = (panel) => {
  panel.classList.add('hidden')
}

const saveCurrentCustomer = (customer) => {
  sessionStorage.setItem(CURRENT_CUSTOMER_KEY, JSON.stringify(customer))
}

const clearCurrentCustomer = () => {
  sessionStorage.removeItem(CURRENT_CUSTOMER_KEY)
}

const getCurrentCustomer = () => {
  const storedCustomer = sessionStorage.getItem(CURRENT_CUSTOMER_KEY)

  if (!storedCustomer) {
    return null
  }

  try {
    return JSON.parse(storedCustomer)
  } catch (error) {
    console.error('Error parsing stored customer:', error)
    sessionStorage.removeItem(CURRENT_CUSTOMER_KEY)
    return null
  }
}

const setCustomerDisplay = (customer) => {
  customerNameElement.textContent = ` ${customer.firstName} ${customer.lastName}`
}

const renderProducts = (products) => {
  productSelect.innerHTML = ''

  const placeholderOption = document.createElement('option')
  placeholderOption.value = ''
  placeholderOption.textContent = '-- Select a Product --'
  productSelect.appendChild(placeholderOption)

  products.forEach((product) => {
    const option = document.createElement('option')
    option.value = product.productCode
    option.textContent = `${product.productCode} - ${product.name}`
    productSelect.appendChild(option)
  })
}

const loadProducts = async () => {
  try {
    const result = await apiRequest(API_ROUTES.PRODUCTS, {}, 'Failed to load products')
    renderProducts(result.data || [])
  } catch (error) {
    console.error('Error loading products:', error)
    showError(error.message)
  }
}

const restoreSession = () => {
  const storedCustomer = getCurrentCustomer()

  if (!storedCustomer) {
    hidePanel(registrationPanel)
    hidePanel(successPanel)
    showPanel(loginPanel)
    return
  }

  currentCustomer = storedCustomer
  setCustomerDisplay(currentCustomer)

  hidePanel(loginPanel)
  hidePanel(successPanel)
  showPanel(registrationPanel)
}

const handleCustomerLogin = async (event) => {
  event.preventDefault()

  const email = emailInput.value.trim()

  if (!email) {
    showError('Please enter your email')
    return
  }

  try {
    const result = await apiRequest(
      API_ROUTES.CUSTOMER_LOGIN,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      },
      'Failed to login customer'
    )

    currentCustomer = result.data
    saveCurrentCustomer(currentCustomer)
    setCustomerDisplay(currentCustomer)

    hidePanel(loginTitle)
    hidePanel(loginPanel)
    hidePanel(successPanel)
    showPanel(registrationPanel)
  } catch (error) {
    console.error('Error logging in customer:', error)
    showError(error.message)
  }
}

const handleProductRegistration = async (event) => {
  event.preventDefault()

  if (!currentCustomer) {
    showError('Please login first')
    return
  }

  const productCode = productSelect.value

  if (!productCode) {
    showError('Please select a product')
    return
  }

  try {
    const result = await apiRequest(
      API_ROUTES.REGISTRATIONS,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: currentCustomer.customerId,
          productCode
        })
      },
      'Failed to register product'
    )

    const registeredProductName =
      result.data?.product?.name || productSelect.selectedOptions[0]?.textContent || productCode

    successMessageElement.textContent = `Product (${registeredProductName}) was registered successfully.`

    hidePanel(loginPanel)
    hidePanel(registrationPanel)
    showPanel(successPanel)
  } catch (error) {
    console.error('Error registering product:', error)
    showError(error.message)
  }
}

const handleRegisterAnother = () => {
  hidePanel(successPanel)
  showPanel(registrationPanel)
  productSelect.value = ''
}

const handleLogout = () => {
  currentCustomer = null
  clearCurrentCustomer()

  emailInput.value = ''
  productSelect.value = ''
  successMessageElement.textContent = 'Product registered successfully.'

  hidePanel(loginTitle)
  hidePanel(registrationPanel)
  hidePanel(successPanel)
  showPanel(loginPanel)
}

if (loginForm) {
  loginForm.addEventListener('submit', handleCustomerLogin)
}

if (registrationForm) {
  registrationForm.addEventListener('submit', handleProductRegistration)
}

if (registerAnotherButton) {
  registerAnotherButton.addEventListener('click', handleRegisterAnother)
}

if (logoutButton) {
  logoutButton.addEventListener('click', handleLogout)
}

loadProducts()
restoreSession()
