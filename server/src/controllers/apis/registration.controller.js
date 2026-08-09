import registrationService from '../../services/registration.service.js'

// GET /api/registrations/:customerId
export const getCustomerRegistrations = async (req, res) => {
  const { customerId } = req.params

  const registrations = await registrationService.getCustomerRegistrations(customerId)

  return res.status(200).json({
    success: true,
    data: registrations
  })
}

// POST /api/registrations
export const createRegistration = async (req, res) => {
  const { customerId, productCode } = req.body

  const registration = await registrationService.createRegistration({
    actorUserId: req.user.userId,
    actorRole: req.user.role,
    customerId,
    productCode
  })

  return res.status(201).json({
    success: true,
    message: 'Product registered successfully',
    data: registration
  })
}
