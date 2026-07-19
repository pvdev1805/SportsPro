import { Router } from 'express'
import * as technicianController from '../../controllers/apis/technician.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

router.get('/', asyncHandler(technicianController.getAllTechnicians))
router.get('/:id', asyncHandler(technicianController.getTechnicianById))
router.post('/', asyncHandler(technicianController.createTechnician))
router.put('/:id', asyncHandler(technicianController.updateTechnician))
router.delete('/:id', asyncHandler(technicianController.deleteTechnician))

export default router
