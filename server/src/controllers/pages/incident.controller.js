export const renderIncidentDisplayPage = (req, res) => {
  res.render('pages/incidents/display', {
    title: 'Display Incidents'
  })
}

export const renderIncidentCreatePage = (req, res) => {
  res.render('pages/incidents/create', {
    title: 'Create Incident'
  })
}

export const renderIncidentAssignPage = (req, res) => {
  res.render('pages/incidents/assign', {
    title: 'Assign Incident'
  })
}

export const renderIncidentUpdatePage = (req, res) => {
  res.render('pages/incidents/update', {
    title: 'Update Incident'
  })
}
