import technicianService from '../../services/technician.service.js'

// GET /api/technicians
export const getAllTechnicians = async (req, res) => {
  const technicians = await technicianService.getAllTechnicians()

  res.status(200).json({
    success: true,
    data: technicians
  })
}

// GET /api/technicians/:techId
export const getTechnicianById = async (req, res) => {
  const { techId } = req.params

  const technician = await technicianService.getTechnicianById(techId)

  res.status(200).json({
    success: true,
    data: technician
  })
}

// POST /api/technicians
export const createTechnician = async (req, res) => {
  const technicianData = req.body

  const technician = await technicianService.createTechnician(technicianData)

  res.status(201).json({
    success: true,
    message: 'Technician created successfully',
    data: technician
  })
}

// PUT /api/technicians/:techId
export const updateTechnician = async (req, res) => {
  const { techId } = req.params

  const technicianData = req.body

  const technician = await technicianService.updateTechnician(techId, technicianData)

  res.status(200).json({
    success: true,
    message: 'Technician updated successfully',
    data: technician
  })
}

// DELETE /api/technicians/:techId
export const deleteTechnician = async (req, res) => {
  const { techId } = req.params

  const technician = await technicianService.deleteTechnician(techId)

  res.status(200).json({
    success: true,
    message: 'Technician deleted successfully',
    data: technician
  })
}
