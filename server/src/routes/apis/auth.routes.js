import { Router } from 'express'
import authController from '../../controllers/apis/auth.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import { loginSchema, registerSchema } from '../../validators/auth.validator.js'

const router = Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new customer account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRegisterResponse'
 *       409:
 *         description: Email already exists
 *       400:
 *         description: Invalid registration data
 */
router.post('/register', validate(registerSchema), authController.register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', validate(loginSchema), authController.login)

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh the access token using the refreshToken cookie
 *     description: Requires a valid refreshToken cookie set by the login or register endpoint.
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRefreshResponse'
 *       401:
 *         description: Refresh token is missing, invalid, revoked, or expired
 */
router.post('/refresh', authController.refresh)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout the current user
 *     description: Revokes the refreshToken cookie if present and clears the cookie from the client.
 *     responses:
 *       204:
 *         description: Logged out successfully
 */
router.post('/logout', authController.logout)

export default router
