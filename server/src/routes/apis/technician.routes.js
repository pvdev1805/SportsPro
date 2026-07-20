import { Router } from 'express'
import * as technicianController from '../../controllers/apis/technician.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

/**
 * @swagger
 * /api/technicians:
 *   get:
 *     tags:
 *       - Technicians
 *     summary: Retrieve all technicians
 *     responses:
 *       200:
 *         description: A list of technicians
 */
router.get('/', asyncHandler(technicianController.getAllTechnicians))

/**
 * @swagger
 * /api/technicians/{techId}:
 *   get:
 *     tags:
 *       - Technicians
 *     summary: Retrieve a technician by ID
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
 *       404:
 *         description: Technician not found
 */
router.get('/:techId', asyncHandler(technicianController.getTechnicianById))

/**
 * @swagger
 * /api/technicians:
 *   post:
 *     tags:
 *       - Technicians
 *     summary: Create a technician
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Technician'
 *     responses:
 *       201:
 *         description: Technician created successfully
 *       409:
 *         description: Technician already exists
 */
router.post('/', asyncHandler(technicianController.createTechnician))

/**
 * @swagger
 * /api/technicians/{techId}:
 *   put:
 *     tags:
 *       - Technicians
 *     summary: Update a technician by ID
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
 *       404:
 *         description: Technician not found
 */
router.put('/:techId', asyncHandler(technicianController.updateTechnician))

/**
 * @swagger
 * /api/technicians/{techId}:
 *   delete:
 *     tags:
 *       - Technicians
 *     summary: Delete a technician by ID
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
 *       404:
 *         description: Technician not found
 */
router.delete('/:techId', asyncHandler(technicianController.deleteTechnician))

export default router
