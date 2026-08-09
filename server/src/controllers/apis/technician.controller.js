import technicianService from '../../services/technician.service.js'

// GET /api/technicians
export const getAllTechnicians = async (req, res) => {
  const technicians = await technicianService.getAllTechnicians()

  return res.status(200).json({
    success: true,
    data: technicians
  })
}

// GET /api/technicians/:techId
export const getTechnicianById = async (req, res) => {
  const { techId } = req.validated.params

  const technician = await technicianService.getTechnicianById(techId)

  return res.status(200).json({
    success: true,
    data: technician
  })
}

// POST /api/technicians
export const createTechnician = async (req, res) => {
  const technician = await technicianService.createTechnician(req.validated.body)

  return res.status(201).json({
    success: true,
    message: 'Technician created successfully',
    data: technician
  })
}

// PATCH /api/technicians/:techId
export const updateTechnician = async (req, res) => {
  const { techId } = req.validated.params

  const technician = await technicianService.updateTechnician(techId, req.validated.body)

  return res.status(200).json({
    success: true,
    message: 'Technician updated successfully',
    data: technician
  })
}

// DELETE /api/technicians/:techId
export const deleteTechnician = async (req, res) => {
  const { techId } = req.validated.params

  await technicianService.deleteTechnician(techId)

  return res.status(200).json({
    success: true,
    message: 'Technician deactivated successfully'
  })
}
