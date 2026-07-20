import { Router } from 'express'
import * as incidentController from '../../controllers/pages/incident.controller.js'

const router = Router()

router.get('/', incidentController.renderIncidentDisplayPage)

router.get('/create', incidentController.renderIncidentCreatePage)

router.get('/assign', incidentController.renderIncidentAssignPage)

router.get('/update', incidentController.renderIncidentUpdatePage)

export default router
