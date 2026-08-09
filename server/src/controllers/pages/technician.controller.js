import technicianService from '../../services/technician.service.js'

// GET /technicians
export const renderTechnicianPage = async (req, res) => {
  const technicians = await technicianService.getAllTechnicians()

  return res.render('pages/technicians', {
    title: 'Manage Technicians',
    technicians
  })
}

// GET /technicians/create
export const renderTechnicianCreatePage = (req, res) => {
  return res.render('pages/technician-create', {
    title: 'Add Technician'
  })
}

// GET /technicians/:techId/edit
export const renderTechnicianEditPage = async (req, res) => {
  const { techId } = req.validated.params

  const technician = await technicianService.getTechnicianById(techId)

  return res.render('pages/technician-edit', {
    title: 'Edit Technician',
    technician
  })
}
