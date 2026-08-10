import { restoreSession } from '../auth/auth-session.js'
import { getNavigationForRole } from '../auth/role-navigation.js'

const guestHome = document.querySelector('#guest-home')

const authenticatedHome = document.querySelector('#authenticated-home')

const errorElement = document.querySelector('#home-error')

const welcomeMessage = document.querySelector('#home-welcome-message')

const roleTitle = document.querySelector('#home-role-title')

const menuList = document.querySelector('#home-menu-list')

const formatRole = (role) => {
  if (!role) {
    return ''
  }

  return role.charAt(0).toUpperCase() + role.slice(1)
}

const renderGuestHome = () => {
  authenticatedHome.classList.add('hidden')
  guestHome.classList.remove('hidden')
}

const renderAuthenticatedHome = (user) => {
  guestHome.classList.add('hidden')
  authenticatedHome.classList.remove('hidden')

  welcomeMessage.textContent = `Signed in as ${user.email}`

  roleTitle.textContent = `${formatRole(user.role)} Menu`

  menuList.replaceChildren()

  const navigationItems = getNavigationForRole(user.role)

  for (const item of navigationItems) {
    if (item.href === '/') {
      continue
    }

    const listItem = document.createElement('li')

    const link = document.createElement('a')

    link.href = item.href
    link.textContent = item.label

    listItem.appendChild(link)
    menuList.appendChild(listItem)
  }
}

const init = async () => {
  try {
    const authState = await restoreSession()

    if (!authState.isAuthenticated) {
      renderGuestHome()
      return
    }

    renderAuthenticatedHome(authState.user)
  } catch (error) {
    console.error('Unable to initialize home page:', error)

    errorElement.textContent = error.message || 'Unable to load the home page.'

    errorElement.hidden = false

    renderGuestHome()
  }
}

init()
