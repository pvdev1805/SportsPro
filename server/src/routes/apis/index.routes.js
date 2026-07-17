import { Router } from 'express'
import customerRoutes from './customer.routes.js'
import productRoutes from './product.routes.js'
import registrationRoutes from './registration.routes.js'
import technicianRoutes from './technician.routes.js'

const router = Router()

router.use('/customers', customerRoutes)
router.use('/products', productRoutes)
router.use('/registrations', registrationRoutes)
router.use('/technicians', technicianRoutes)

export default router
