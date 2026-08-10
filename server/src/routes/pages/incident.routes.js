import { Router } from 'express'

import * as incidentController from '../../controllers/pages/incident.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import { incidentIdParamsOnlySchema } from '../../validators/incident.validator.js'

const router = Router()

router.get('/', incidentController.renderIncidentDisplayPage)

router.get('/create', incidentController.renderIncidentCreatePage)

router.get('/assign', incidentController.renderIncidentAssignPage)

router.get('/:incidentId/edit', validate(incidentIdParamsOnlySchema), incidentController.renderIncidentUpdatePage)

export default router
