import registrationService from '../../services/registration.service.js'
import asyncHandler from '../../utils/async-handler.js'

// GET /api/registrations/:customerId
export const getCustomerRegistrations = asyncHandler(async (req, res) => {
  const { customerId } = req.params

  const registrations = await registrationService.getCustomerRegistrations(customerId)

  res.status(200).json({
    success: true,
    data: registrations
  })
})

// POST /api/registrations
export const createRegistration = asyncHandler(async (req, res) => {
  const { customerId, productCode } = req.body

  const registration = await registrationService.createRegistration(customerId, productCode)

  res.status(201).json({
    success: true,
    message: 'Product registered successfully',
    data: registration
  })
})
