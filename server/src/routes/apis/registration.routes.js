import { Router } from 'express'
import * as registrationController from '../../controllers/apis/registration.controller.js'

const router = Router()

router.get('/:customerId', registrationController.getCustomerRegistrations)
router.post('/', registrationController.createRegistration)

export default router
