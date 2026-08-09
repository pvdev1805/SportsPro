import { Router } from 'express'

import { USER_ROLES } from '../../constants/user-roles.js'
import * as incidentController from '../../controllers/apis/incident.controller.js'
import authenticate from '../../middlewares/authenticate.middleware.js'
import authorize from '../../middlewares/authorize.middleware.js'
import authorizeIncidentAccess from '../../middlewares/incident-access.middleware.js'
import asyncHandler from '../../utils/async-handler.js'
import validate from '../../middlewares/validate.middleware.js'
import {
  assignTechnicianSchema,
  createIncidentSchema,
  incidentIdParamsOnlySchema,
  updateIncidentSchema,
  updateIncidentStatusSchema
} from '../../validators/incident.validator.js'

const router = Router()

// GET /api/incidents
// Admin: retrieve all incidents
router.get('/', authenticate, authorize(USER_ROLES.ADMIN), asyncHandler(incidentController.getAllIncidents))

// GET /api/incidents/assigned
// Technician: retrieve incidents assigned to the authenticated technician
router.get(
  '/assigned',
  authenticate,
  authorize(USER_ROLES.TECHNICIAN),
  asyncHandler(incidentController.getAssignedIncidents)
)

// GET /api/incidents/mine
// Customer: retrieve incidents belonging to the authenticated customer
router.get('/mine', authenticate, authorize(USER_ROLES.CUSTOMER), asyncHandler(incidentController.getMyIncidents))

// POST /api/incidents
// Admin can create for a specified customer.
// Customer can only create for themselves.
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
  validate(createIncidentSchema),
  asyncHandler(incidentController.createIncident)
)

// GET /api/incidents/:incidentId
// Admin: any incident
// Technician: assigned incident only
// Customer: own incident only
router.get(
  '/:incidentId',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.CUSTOMER),
  validate(incidentIdParamsOnlySchema),
  authorizeIncidentAccess,
  asyncHandler(incidentController.getIncidentById)
)

// PATCH /api/incidents/:incidentId
// Admin: any incident
// Technician: assigned incident only
// Customer: own incident only; service further restricts customer to open incidents
router.patch(
  '/:incidentId',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.CUSTOMER),
  validate(updateIncidentSchema),
  authorizeIncidentAccess,
  asyncHandler(incidentController.updateIncident)
)

// PATCH /api/incidents/:incidentId/assign
// Only administrators can assign or reassign technicians.
router.patch(
  '/:incidentId/assign',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(assignTechnicianSchema),
  asyncHandler(incidentController.assignTechnician)
)

// PATCH /api/incidents/:incidentId/status
// Admin may update any valid incident workflow.
// Technician may update only an incident assigned to them.
// The service performs the assignment check again.
router.patch(
  '/:incidentId/status',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN),
  validate(updateIncidentStatusSchema),
  asyncHandler(incidentController.updateIncidentStatus)
)

export default router
