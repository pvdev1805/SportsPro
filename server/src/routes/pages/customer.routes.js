import { Router } from 'express'
import * as customerController from '../../controllers/pages/customer.controller.js'

const router = Router()

router.get('/', customerController.renderCustomerPage)

export default router
