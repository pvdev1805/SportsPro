import { Router } from 'express'
import * as registrationController from '../../controllers/apis/registration.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     tags:
 *       - Registrations
 *     summary: Register a product for a customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - productCode
 *             properties:
 *               customerId:
 *                 type: integer
 *                 example: 1
 *               productCode:
 *                 type: string
 *                 example: DRAFT10
 *     responses:
 *       201:
 *         description: Product registered successfully
 *       404:
 *         description: Customer or product not found
 *       409:
 *         description: Product already registered to customer
 */
router.post('/', asyncHandler(registrationController.createRegistration))

/**
 * @swagger
 * /api/registrations/{customerId}:
 *   get:
 *     tags:
 *       - Registrations
 *     summary: Retrieve registrations for a customer
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: A list of registrations
 *       404:
 *         description: Customer not found
 */
router.get('/:customerId', asyncHandler(registrationController.getCustomerRegistrations))

export default router
