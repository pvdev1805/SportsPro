import { Router } from 'express'
import * as homeController from '../../controllers/pages/home.controller.js'

const router = Router()

router.get('/', homeController.renderHomePage)

export default router
