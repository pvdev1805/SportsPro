const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Registration API has not been implemented yet'
  })
}

export const getCustomerRegistrations = notImplemented
export const createRegistration = notImplemented
