import { Router } from 'express'
import * as registrationController from '../../controllers/pages/registration.controller.js'

const router = Router()

router.get('/', registrationController.renderRegistrationPage)

export default router
