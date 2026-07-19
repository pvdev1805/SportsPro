import technicianService from '../../services/technician.service.js'

// GET /technicians
export const renderTechnicianPage = async (req, res) => {
  const technicians = await technicianService.getAllTechnicians()

  res.render('pages/technicians', {
    title: 'Manage Technicians',
    technicians
  })
}

// GET /technicians/create
export const renderTechnicianCreatePage = (req, res) => {
  res.render('pages/technician-create', {
    title: 'Add Technician'
  })
}

// GET /technicians/:technicianId/edit
export const renderTechnicianEditPage = async (req, res) => {
  const { technicianId } = req.params
  const technician = await technicianService.getTechnicianById(technicianId)

  res.render('pages/technician-edit', {
    title: 'Edit Technician',
    technician
  })
}
