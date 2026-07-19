import { Router } from 'express'
import * as customerController from '../../controllers/apis/customer.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

router.get('/', asyncHandler(customerController.getAllCustomers))
router.get('/search', asyncHandler(customerController.searchCustomers))
router.post('/login', asyncHandler(customerController.loginCustomer))
router.get('/:customerId', asyncHandler(customerController.getCustomerById))
router.put('/:customerId', asyncHandler(customerController.updateCustomer))

export default router
