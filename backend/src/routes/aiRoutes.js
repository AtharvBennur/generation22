import express from 'express'
import { generateAIEssay, refineAIEssay } from '../controllers/aiController.js'

const router = express.Router()

// AI generation routes
router.post('/generate', generateAIEssay)
router.post('/refine', refineAIEssay)

export default router
