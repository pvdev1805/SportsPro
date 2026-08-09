import incidentService from '../../services/incident.service.js'

// GET /api/incidents
export const getAllIncidents = async (req, res) => {
  const incidents = await incidentService.getAllIncidents()

  return res.status(200).json({
    success: true,
    data: incidents
  })
}

// GET /api/incidents/assigned
export const getAssignedIncidents = async (req, res) => {
  const incidents = await incidentService.getAssignedIncidentsForUser(req.user.userId)

  return res.status(200).json({
    success: true,
    data: incidents
  })
}

// GET /api/incidents/mine
export const getMyIncidents = async (req, res) => {
  const incidents = await incidentService.getCustomerIncidentsForUser(req.user.userId)

  return res.status(200).json({
    success: true,
    data: incidents
  })
}

// GET /api/incidents/:incidentId
export const getIncidentById = async (req, res) => {
  const { incidentId } = req.params

  const incident = await incidentService.getIncidentById(incidentId)

  return res.status(200).json({
    success: true,
    data: incident
  })
}

// POST /api/incidents
export const createIncident = async (req, res) => {
  const { customerId, productCode, title, description } = req.body

  const incident = await incidentService.createIncident({
    actorUserId: req.user.userId,
    actorRole: req.user.role,
    customerId,
    productCode,
    title,
    description
  })

  return res.status(201).json({
    success: true,
    message: 'Incident created successfully',
    data: incident
  })
}

// PUT /api/incidents/:incidentId
export const updateIncident = async (req, res) => {
  const { incidentId } = req.params
  const { productCode, title, description } = req.body

  const incident = await incidentService.updateIncident({
    incidentId,
    actorUserId: req.user.userId,
    actorRole: req.user.role,
    productCode,
    title,
    description
  })

  return res.status(200).json({
    success: true,
    message: 'Incident updated successfully',
    data: incident
  })
}

// PATCH /api/incidents/:incidentId/assign
export const assignTechnician = async (req, res) => {
  const { incidentId } = req.params
  const { techId } = req.body

  const incident = await incidentService.assignTechnician(incidentId, techId)

  return res.status(200).json({
    success: true,
    message: 'Technician assigned successfully',
    data: incident
  })
}

// PATCH /api/incidents/:incidentId/status
export const updateIncidentStatus = async (req, res) => {
  const { incidentId } = req.params
  const { status } = req.body

  const incident = await incidentService.updateIncidentStatus({
    incidentId,
    actorUserId: req.user.userId,
    actorRole: req.user.role,
    status
  })

  return res.status(200).json({
    success: true,
    message: 'Incident status updated successfully',
    data: incident
  })
}
