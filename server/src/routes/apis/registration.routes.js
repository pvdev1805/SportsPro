import { Router } from 'express'
import * as registrationController from '../../controllers/apis/registration.controller.js'
import asyncHandler from '../../utils/async-handler.js'
import { USER_ROLES } from '../../constants/user-roles.js'
import authenticate from '../../middlewares/authenticate.middleware.js'
import authorize from '../../middlewares/authorize.middleware.js'
import authorizeCustomerAccess from '../../middlewares/customer-access.middleware.js'

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
 *               - productCode
 *             properties:
 *               customerId:
 *                 type: integer
 *                 example: 1
 *                 description: Required when an administrator registers a product for a customer
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
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
  asyncHandler(registrationController.createRegistration)
)

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
router.get(
  '/:customerId',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
  authorizeCustomerAccess,
  asyncHandler(registrationController.getCustomerRegistrations)
)

export default router
