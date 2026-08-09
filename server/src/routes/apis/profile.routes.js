import { Router } from 'express'

import profileController from '../../controllers/apis/profile.controller.js'
import authenticate from '../../middlewares/authenticate.middleware.js'

const router = Router()

router.get('/', authenticate, profileController.getProfile)

export default router
