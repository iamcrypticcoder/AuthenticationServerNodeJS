import path from 'path'
import * as express from 'express'

import IndexController from "../controllers"

const router = express.Router()
const indexController = new IndexController()

router.get('', indexController.getHomePage)


export default router