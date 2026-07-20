import { Router } from 'express'
import * as technicianController from '../../controllers/pages/technician.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

router.get('/', asyncHandler(technicianController.renderTechnicianPage))
router.get('/create', asyncHandler(technicianController.renderTechnicianCreatePage))
router.get('/:technicianId/edit', asyncHandler(technicianController.renderTechnicianEditPage))

export default router
