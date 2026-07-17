import { Router } from 'express'
import homeRoutes from './home.routes.js'
import productRoutes from './product.routes.js'
import customerRoutes from './customer.routes.js'
import registrationRoutes from './registration.routes.js'
import technicianRoutes from './technician.routes.js'
import incidentRoutes from './incident.routes.js'

const router = Router()

router.use('/', homeRoutes)
router.use('/products', productRoutes)
router.use('/customers', customerRoutes)
router.use('/register-product', registrationRoutes)
router.use('/technicians', technicianRoutes)
router.use('/incidents', incidentRoutes)

export default router
