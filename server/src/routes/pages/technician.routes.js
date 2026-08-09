import { Router } from 'express'
import * as technicianController from '../../controllers/pages/technician.controller.js'
import asyncHandler from '../../utils/async-handler.js'
import validate from '../../middlewares/validate.middleware.js'
import { technicianIdParamsOnlySchema } from '../../validators/technician.validator.js'

const router = Router()

router.get('/', asyncHandler(technicianController.renderTechnicianPage))
router.get('/create', asyncHandler(technicianController.renderTechnicianCreatePage))
router.get(
  '/:technicianId/edit',
  validate(technicianIdParamsOnlySchema),
  asyncHandler(technicianController.renderTechnicianEditPage)
)

export default router
