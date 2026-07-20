import { Router } from 'express'
import * as customerController from '../../controllers/apis/customer.controller.js'
import asyncHandler from '../../utils/async-handler.js'

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
router.get('/', asyncHandler(customerController.getAllCustomers))

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
router.get('/search', asyncHandler(customerController.searchCustomers))

/**
 * @swagger
 * /api/customers/login:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Customer login using email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: daniel.roberts@example.com
 *     responses:
 *       200:
 *         description: Customer login successful
 *       401:
 *         description: Customer is not registered
 */
router.post('/login', asyncHandler(customerController.loginCustomer))

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
router.get('/:customerId', asyncHandler(customerController.getCustomerById))

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
router.put('/:customerId', asyncHandler(customerController.updateCustomer))

export default router
