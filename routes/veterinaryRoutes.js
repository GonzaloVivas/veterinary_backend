import express from 'express'
import { register, profile, confirmAccount, login, resetPassword, checkToken, changePassword, updateProfile, updatePassword } from '../controllers/veterinaryController.js'
import checkAuth from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', register)
router.get('/confirmar/:token', confirmAccount)
router.post('/login', login)
router.post('/recuperar-password', resetPassword)
router.route('/recuperar-password/:token')
  .get(checkToken)
  .post(changePassword)

router.get('/perfil', checkAuth, profile)
router.put('/perfil/:id', checkAuth, updateProfile)
router.put('/actualizar-password', checkAuth, updatePassword)

export default router