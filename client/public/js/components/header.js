import { PAGE_ROUTES } from '../constants/routes.js'
import { restoreSession, signOut } from '../auth/auth-session.js'
import { subscribeToAuth } from '../auth/auth-store.js'
import { getNavigationForRole } from '../auth/role-navigation.js'

const guestActions = document.querySelector('#guest-actions')

const userActions = document.querySelector('#user-actions')

const userEmail = document.querySelector('#header-user-email')

const userRole = document.querySelector('#header-user-role')

const logoutButton = document.querySelector('#logout-button')

const navigation = document.querySelector('#role-navigation')

const navigationList = document.querySelector('#role-navigation-list')

const formatRole = (role) => {
  if (!role) {
    return ''
  }

  return role.charAt(0).toUpperCase() + role.slice(1)
}

const renderNavigation = (role) => {
  const items = getNavigationForRole(role)

  navigationList.replaceChildren()

  for (const item of items) {
    const listItem = document.createElement('li')
    const link = document.createElement('a')

    link.href = item.href
    link.textContent = item.label

    if (window.location.pathname === item.href) {
      link.classList.add('active')
      link.setAttribute('aria-current', 'page')
    }

    listItem.appendChild(link)
    navigationList.appendChild(listItem)
  }

  navigation.hidden = items.length === 0
}

const clearNavigation = () => {
  navigationList.replaceChildren()
  navigation.hidden = true
}

const renderAuthState = ({ user, isAuthenticated }) => {
  if (isAuthenticated) {
    guestActions.hidden = true
    userActions.hidden = false

    userEmail.textContent = user.email
    userRole.textContent = formatRole(user.role)

    renderNavigation(user.role)

    return
  }

  userActions.hidden = true
  guestActions.hidden = false

  userEmail.textContent = ''
  userRole.textContent = ''

  clearNavigation()
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
