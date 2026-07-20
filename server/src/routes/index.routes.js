import { Router } from 'express'
import pageRoutes from './pages/index.routes.js'
import apiRoutes from './apis/index.routes.js'

const router = Router()

router.use('/', pageRoutes)
router.use('/api', apiRoutes)

export default router
