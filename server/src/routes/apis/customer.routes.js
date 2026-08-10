import { Router } from 'express'
import * as customerController from '../../controllers/apis/customer.controller.js'
import asyncHandler from '../../utils/async-handler.js'
import { USER_ROLES } from '../../constants/user-roles.js'
import authenticate from '../../middlewares/authenticate.middleware.js'
import authorize from '../../middlewares/authorize.middleware.js'
import authorizeCustomerAccess from '../../middlewares/customer-access.middleware.js'
import validate from '../../middlewares/validate.middleware.js'
import {
  customerIdParamsOnlySchema,
  searchCustomersSchema,
  updateCustomerSchema
} from '../../validators/customer.validator.js'

const router = Router()

/**
 * @swagger
 * /api/customers:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Retrieve all customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerListResponse'
 */
router.get('/', authenticate, authorize(USER_ROLES.ADMIN), asyncHandler(customerController.getAllCustomers))

/**
 * @swagger
 * /api/customers/search:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Search customers by last name
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerListResponse'
 */
router.get(
  '/search',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(searchCustomersSchema),
  asyncHandler(customerController.searchCustomers)
)

/**
 * @swagger
 * /api/customers/{customerId}:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Retrieve customer details by ID
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
 *       404:
 *         description: Customer not found
 */
router.get(
  '/:customerId',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
  validate(customerIdParamsOnlySchema),
  authorizeCustomerAccess,
  asyncHandler(customerController.getCustomerById)
)

/**
 * @swagger
 * /api/customers/{customerId}:
 *   patch:
 *     tags:
 *       - Customers
 *     summary: Partially update customer information
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerMutationResponse'
 *       404:
 *         description: Customer not found
 */
router.patch(
  '/:customerId',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
  validate(updateCustomerSchema),
  authorizeCustomerAccess,
  asyncHandler(customerController.updateCustomer)
)

export default router
