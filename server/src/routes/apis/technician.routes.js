import { Router } from 'express'
import * as technicianController from '../../controllers/apis/technician.controller.js'
import asyncHandler from '../../utils/async-handler.js'
import { USER_ROLES } from '../../constants/user-roles.js'
import authenticate from '../../middlewares/authenticate.middleware.js'
import authorize from '../../middlewares/authorize.middleware.js'
import validate from '../../middlewares/validate.middleware.js'
import {
  createTechnicianSchema,
  technicianIdParamsOnlySchema,
  updateTechnicianSchema
} from '../../validators/technician.validator.js'

const router = Router()

/**
 * @swagger
 * /api/technicians:
 *   get:
 *     tags:
 *       - Technicians
 *     summary: Retrieve all technicians
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of technicians
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TechnicianListResponse'
 */
router.get('/', authenticate, authorize(USER_ROLES.ADMIN), asyncHandler(technicianController.getAllTechnicians))

/**
 * @swagger
 * /api/technicians/{techId}:
 *   get:
 *     tags:
 *       - Technicians
 *     summary: Retrieve a technician by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: techId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Technician ID
 *     responses:
 *       200:
 *         description: Technician details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TechnicianResponse'
 *       404:
 *         description: Technician not found
 */
router.get(
  '/:techId',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(technicianIdParamsOnlySchema),
  asyncHandler(technicianController.getTechnicianById)
)

/**
 * @swagger
 * /api/technicians:
 *   post:
 *     tags:
 *       - Technicians
 *     summary: Create a technician
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Technician'
 *     responses:
 *       201:
 *         description: Technician created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TechnicianMutationResponse'
 *       409:
 *         description: Technician already exists
 */
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(createTechnicianSchema),
  asyncHandler(technicianController.createTechnician)
)

/**
 * @swagger
 * /api/technicians/{techId}:
 *   patch:
 *     tags:
 *       - Technicians
 *     summary: Partially update a technician by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: techId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Technician ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Technician'
 *     responses:
 *       200:
 *         description: Technician updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TechnicianMutationResponse'
 *       404:
 *         description: Technician not found
 */
router.patch(
  '/:techId',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(updateTechnicianSchema),
  asyncHandler(technicianController.updateTechnician)
)

/**
 * @swagger
 * /api/technicians/{techId}:
 *   delete:
 *     tags:
 *       - Technicians
 *     summary: Delete a technician by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: techId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Technician ID
 *     responses:
 *       200:
 *         description: Technician deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Technician not found
 */
router.delete(
  '/:techId',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(technicianIdParamsOnlySchema),
  asyncHandler(technicianController.deleteTechnician)
)

export default router
