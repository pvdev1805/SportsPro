import { Router } from 'express'
import authRoutes from './auth.routes.js'
import customerRoutes from './customer.routes.js'
import incidentRoutes from './incident.routes.js'
import productRoutes from './product.routes.js'
import registrationRoutes from './registration.routes.js'
import technicianRoutes from './technician.routes.js'
import profileRoutes from './profile.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/customers', customerRoutes)
router.use('/incidents', incidentRoutes)
router.use('/products', productRoutes)
router.use('/registrations', registrationRoutes)
router.use('/technicians', technicianRoutes)
router.use('/profile', profileRoutes)

export default router
