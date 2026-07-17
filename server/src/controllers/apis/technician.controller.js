const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Technician API has not been implemented yet'
  })
}

export const getAllTechnicians = notImplemented
export const getTechnicianById = notImplemented
export const createTechnician = notImplemented
export const updateTechnician = notImplemented
export const deleteTechnician = notImplemented
