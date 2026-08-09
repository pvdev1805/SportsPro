import { Router } from 'express'
import * as customerController from '../../controllers/apis/customer.controller.js'
import asyncHandler from '../../utils/async-handler.js'
import { USER_ROLES } from '../../constants/user-roles.js'
import authenticate from '../../middlewares/authenticate.middleware.js'
import authorize from '../../middlewares/authorize.middleware.js'
import authorizeCustomerAccess from '../../middlewares/customer-access.middleware.js'

const router = Router()

/**
 * @swagger
 * /api/customers:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Retrieve all customers
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 */
router.get('/', authenticate, authorize(USER_ROLES.ADMIN), asyncHandler(customerController.getAllCustomers))

/**
 * @swagger
 * /api/customers/search:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Search customers by last name
 *     parameters:
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         required: true
 *         description: Last name search keyword
 *     responses:
 *       200:
 *         description: Matching customers
 */
router.get('/search', authenticate, authorize(USER_ROLES.ADMIN), asyncHandler(customerController.searchCustomers))

/**
 * @swagger
 * /api/customers/{customerId}:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Retrieve customer details by ID
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer details
 *       404:
 *         description: Customer not found
 */
router.get(
  '/:customerId',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
  authorizeCustomerAccess,
  asyncHandler(customerController.getCustomerById)
)

/**
 * @swagger
 * /api/customers/{customerId}:
 *   put:
 *     tags:
 *       - Customers
 *     summary: Update customer information
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 */
router.put(
  '/:customerId',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
  authorizeCustomerAccess,
  asyncHandler(customerController.updateCustomer)
)

export default router
