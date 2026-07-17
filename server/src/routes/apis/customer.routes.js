import { Router } from 'express'
import * as customerController from '../../controllers/apis/customer.controller.js'

const router = Router()

router.get('/', customerController.getAllCustomers)
router.get('/search', customerController.searchCustomers)
router.post('/login', customerController.loginCustomer)
router.get('/:id', customerController.getCustomerById)
router.put('/:id', customerController.updateCustomer)

export default router
