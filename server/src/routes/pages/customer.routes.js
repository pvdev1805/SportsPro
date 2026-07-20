import { Router } from 'express'
import * as customerController from '../../controllers/pages/customer.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

router.get('/', asyncHandler(customerController.renderCustomerPage))
router.get('/:customerId/edit', asyncHandler(customerController.renderCustomerEditPage))

export default router
