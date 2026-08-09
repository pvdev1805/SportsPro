import { Router } from 'express'
import authController from '../../controllers/apis/auth.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import { loginSchema, registerSchema } from '../../validators/auth.validator.js'

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)

export default router
