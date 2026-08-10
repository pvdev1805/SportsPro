const getFieldErrorId = (field) => {
  return `${field}-error`
}

export const clearFieldErrors = (form) => {
  const errorElements = form.querySelectorAll('[data-field-error]')

  for (const element of errorElements) {
    element.textContent = ''
    element.hidden = true
  }

  const invalidFields = form.querySelectorAll('[aria-invalid="true"]')

  for (const field of invalidFields) {
    field.removeAttribute('aria-invalid')
    field.removeAttribute('aria-describedby')
  }
}

export const showFieldErrors = (form, errors) => {
  clearFieldErrors(form)

  for (const error of errors) {
    const field = form.elements.namedItem(error.field)

    if (!field) {
      continue
    }

    const errorId = getFieldErrorId(error.field)

    let errorElement = form.querySelector(`#${errorId}`)

    if (!errorElement) {
      errorElement = document.createElement('div')

      errorElement.id = errorId
      errorElement.classList.add('field-error')
      errorElement.dataset.fieldError = ''
      errorElement.setAttribute('role', 'alert')

      field.insertAdjacentElement('afterend', errorElement)
    }

    errorElement.textContent = error.message

    errorElement.hidden = false

    field.setAttribute('aria-invalid', 'true')

    field.setAttribute('aria-describedby', errorId)
  }
}

export const focusFirstInvalidField = (form, errors) => {
  if (errors.length === 0) {
    return
  }

  const field = form.elements.namedItem(errors[0].field)

  field?.focus()
}
