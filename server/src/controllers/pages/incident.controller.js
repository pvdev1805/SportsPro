export const renderIncidentDisplayPage = (req, res) => {
  return res.render('pages/incidents/display', {
    title: 'Incidents'
  })
}

export const renderIncidentCreatePage = (req, res) => {
  return res.render('pages/incidents/create', {
    title: 'Create Incident'
  })
}

export const renderIncidentAssignPage = (req, res) => {
  return res.render('pages/incidents/assign', {
    title: 'Assign Incident'
  })
}

export const renderIncidentUpdatePage = (req, res) => {
  return res.render('pages/incidents/update', {
    title: 'Update Incident'
  })
}
