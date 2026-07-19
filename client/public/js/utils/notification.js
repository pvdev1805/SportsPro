const FLASH_NOTIFICATION_KEY = 'flashNotification'

const notyf = new window.Notyf({
  duration: 3000,
  position: {
    x: 'right',
    y: 'top'
  },
  dismissible: true
})

export const showSuccess = (message) => {
  notyf.success(message)
}

export const showError = (message) => {
  notyf.error(message)
}

export const setFlashNotification = (type, message) => {
  const notification = {
    type,
    message
  }

  sessionStorage.setItem(FLASH_NOTIFICATION_KEY, JSON.stringify(notification))
}

export const showFlashNotification = () => {
  const storedNotification = sessionStorage.getItem(FLASH_NOTIFICATION_KEY)

  if (!storedNotification) {
    return
  }

  sessionStorage.removeItem(FLASH_NOTIFICATION_KEY)

  try {
    const notification = JSON.parse(storedNotification)

    if (notification.type === 'success') {
      showSuccess(notification.message)
      return
    }

    showError(notification.message)
  } catch (error) {
    console.error('Error parsing flash notification:', error)
  }
}
