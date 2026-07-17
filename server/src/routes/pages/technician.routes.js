import { Router } from 'express'
import * as technicianController from '../../controllers/pages/technician.controller.js'

const router = Router()

router.get('/', technicianController.renderTechnicianPage)

export default router
