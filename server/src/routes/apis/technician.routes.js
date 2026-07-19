import { Router } from 'express'
import * as technicianController from '../../controllers/apis/technician.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

router.get('/', asyncHandler(technicianController.getAllTechnicians))
router.get('/:techId', asyncHandler(technicianController.getTechnicianById))
router.post('/', asyncHandler(technicianController.createTechnician))
router.put('/:techId', asyncHandler(technicianController.updateTechnician))
router.delete('/:techId', asyncHandler(technicianController.deleteTechnician))

export default router
