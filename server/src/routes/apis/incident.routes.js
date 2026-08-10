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

/**
 * @swagger
 * /api/incidents:
 *   get:
 *     tags:
 *       - Incidents
 *     summary: Retrieve all incidents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of incidents
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentListResponse'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Administrator access required
 */
router.get('/', authenticate, authorize(USER_ROLES.ADMIN), asyncHandler(incidentController.getAllIncidents))

/**
 * @swagger
 * /api/incidents/assigned:
 *   get:
 *     tags:
 *       - Incidents
 *     summary: Retrieve incidents assigned to the authenticated technician
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of assigned incidents
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentListResponse'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Technician access required
 */
router.get(
  '/assigned',
  authenticate,
  authorize(USER_ROLES.TECHNICIAN),
  asyncHandler(incidentController.getAssignedIncidents)
)

/**
 * @swagger
 * /api/incidents/mine:
 *   get:
 *     tags:
 *       - Incidents
 *     summary: Retrieve incidents belonging to the authenticated customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of customer incidents
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentListResponse'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Customer access required
 */
router.get('/mine', authenticate, authorize(USER_ROLES.CUSTOMER), asyncHandler(incidentController.getMyIncidents))

/**
 * @swagger
 * /api/incidents:
 *   post:
 *     tags:
 *       - Incidents
 *     summary: Create a new incident
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidentCreateRequest'
 *     responses:
 *       201:
 *         description: Incident created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentResponse'
 *       400:
 *         description: Invalid incident data
 *       401:
 *         description: Missing or invalid bearer token
 */
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
  validate(createIncidentSchema),
  asyncHandler(incidentController.createIncident)
)

/**
 * @swagger
 * /api/incidents/{incidentId}:
 *   get:
 *     tags:
 *       - Incidents
 *     summary: Retrieve an incident by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: incidentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Incident ID
 *     responses:
 *       200:
 *         description: Incident details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentResponse'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Access denied for this incident
 *       404:
 *         description: Incident not found
 */
router.get(
  '/:incidentId',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.CUSTOMER),
  validate(incidentIdParamsOnlySchema),
  authorizeIncidentAccess,
  asyncHandler(incidentController.getIncidentById)
)

/**
 * @swagger
 * /api/incidents/{incidentId}:
 *   patch:
 *     tags:
 *       - Incidents
 *     summary: Update an incident
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: incidentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Incident ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidentUpdateRequest'
 *     responses:
 *       200:
 *         description: Incident updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentMutationResponse'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Access denied for this incident
 *       404:
 *         description: Incident not found
 */
router.patch(
  '/:incidentId',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.CUSTOMER),
  validate(updateIncidentSchema),
  authorizeIncidentAccess,
  asyncHandler(incidentController.updateIncident)
)

/**
 * @swagger
 * /api/incidents/{incidentId}/assign:
 *   patch:
 *     tags:
 *       - Incidents
 *     summary: Assign or reassign a technician to an incident
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: incidentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Incident ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidentAssignRequest'
 *     responses:
 *       200:
 *         description: Technician assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentMutationResponse'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Administrator access required
 *       404:
 *         description: Incident or technician not found
 */
router.patch(
  '/:incidentId/assign',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(assignTechnicianSchema),
  asyncHandler(incidentController.assignTechnician)
)

/**
 * @swagger
 * /api/incidents/{incidentId}/status:
 *   patch:
 *     tags:
 *       - Incidents
 *     summary: Update the status of an incident
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: incidentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Incident ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidentStatusRequest'
 *     responses:
 *       200:
 *         description: Incident status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentMutationResponse'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Access denied for this incident
 *       404:
 *         description: Incident not found
 */
router.patch(
  '/:incidentId/status',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN),
  validate(updateIncidentStatusSchema),
  asyncHandler(incidentController.updateIncidentStatus)
)

export default router
