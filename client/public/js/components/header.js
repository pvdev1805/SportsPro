import { PAGE_ROUTES } from '../constants/routes.js'
import { restoreSession, signOut } from '../auth/auth-session.js'
import { subscribeToAuth } from '../auth/auth-store.js'

const guestActions = document.querySelector('#guest-actions')
const userActions = document.querySelector('#user-actions')
const userEmail = document.querySelector('#header-user-email')
const userRole = document.querySelector('#header-user-role')
const logoutButton = document.querySelector('#logout-button')

const formatRole = (role) => {
  if (!role) {
    return ''
  }

  return role.charAt(0).toUpperCase() + role.slice(1)
}

const renderAuthState = ({ user, isAuthenticated }) => {
  if (isAuthenticated) {
    guestActions.hidden = true
    userActions.hidden = false

    userEmail.textContent = user.email
    userRole.textContent = formatRole(user.role)

    return
  }

  userActions.hidden = true
  guestActions.hidden = false

  userEmail.textContent = ''
  userRole.textContent = ''
}

const handleLogout = async () => {
  logoutButton.disabled = true
  logoutButton.textContent = 'Signing out...'

  try {
    await signOut()
  } catch (error) {
    console.error('Logout request failed:', error)
  } finally {
    window.location.replace(PAGE_ROUTES.LOGIN)
  }
}

const init = async () => {
  subscribeToAuth(renderAuthState)

  logoutButton?.addEventListener('click', handleLogout)

  try {
    const authState = await restoreSession()

    renderAuthState(authState)
  } catch (error) {
    console.error('Unable to restore authentication session:', error)

    renderAuthState({
      user: null,
      accessToken: null,
      isAuthenticated: false
    })
  }
}

init()
