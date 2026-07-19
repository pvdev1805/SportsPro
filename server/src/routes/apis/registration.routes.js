import { Router } from 'express'
import * as registrationController from '../../controllers/apis/registration.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

router.post('/', asyncHandler(registrationController.createRegistration))
router.get('/:customerId', asyncHandler(registrationController.getCustomerRegistrations))

export default router
