import express from 'express'
import checkAuth from '../middleware/authMiddleware.js'
import { savePatient, getPatients, getPatient, updatePatient, deletePatient } from '../controllers/patientController.js'

const router = express.Router()

router.route('/')
  .post(checkAuth, savePatient)
  .get(checkAuth, getPatients)

router.route('/:id')
  .get(checkAuth, getPatient)
  .put(checkAuth, updatePatient)
  .delete(checkAuth, deletePatient)

export default router