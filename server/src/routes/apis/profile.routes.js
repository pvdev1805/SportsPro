import { Router } from 'express'

import profileController from '../../controllers/apis/profile.controller.js'
import authenticate from '../../middlewares/authenticate.middleware.js'

const router = Router()

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Retrieve the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: Missing or invalid bearer token
 */
router.get('/', authenticate, profileController.getProfile)

export default router
