import { Router } from 'express'
import * as technicianController from '../../controllers/apis/technician.controller.js'

const router = Router()

router.get('/', technicianController.getAllTechnicians)
router.get('/:id', technicianController.getTechnicianById)
router.post('/', technicianController.createTechnician)
router.put('/:id', technicianController.updateTechnician)
router.delete('/:id', technicianController.deleteTechnician)

export default router
