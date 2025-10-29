import express from 'express'
import { getProductLogs, getUserLogs } from "../controllers/logsController.mjs"

const router = express.Router()

router.get('/products', getProductLogs)
router.get('/users', getUserLogs)

export default router