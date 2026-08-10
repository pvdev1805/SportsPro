// GET /technicians
export const renderTechnicianPage = (req, res) => {
  return res.render('pages/technicians', {
    title: 'Manage Technicians'
  })
}

// GET /technicians/create
export const renderTechnicianCreatePage = (req, res) => {
  return res.render('pages/technician-create', {
    title: 'Add Technician'
  })
}

// GET /technicians/:techId/edit
export const renderTechnicianEditPage = (req, res) => {
  return res.render('pages/technician-edit', {
    title: 'Edit Technician'
  })
}
