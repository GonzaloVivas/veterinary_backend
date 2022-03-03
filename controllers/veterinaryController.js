import Veterinary from '../models/Veterinary.js'
import jwtGenerate from '../helpers/jwtGenerate.js'
import generateToken from '../helpers/generateToken.js'
import registerEmail from '../helpers/registerEmail.js'
import forgotPasswordEmail from '../helpers/forgotPasswordEmail.js'

const register = async (req, res) => {

  const { email, name } = req.body

  const emailExists = await Veterinary.findOne({ email })

  if (emailExists) {
    const error = new Error('El email indicado ya está registrado')
    return res.status(400).json({ message: error.message })
  }

  try {
    
    const veterinary = new Veterinary(req.body)
    const savedVeterinary = await veterinary.save()

    registerEmail({
      name,
      email,
      token: savedVeterinary.token
    })

    res.json({
      veterinary: savedVeterinary
    })

  } catch (error) {
    console.log(error)
  }

}

const profile = (req, res) => {

  const { veterinary } = req

  res.json( veterinary )
}

const updateProfile = async (req, res) => {
  const veterinary = await Veterinary.findById(req.params.id)
  if (!veterinary) {
    const error = new Error('Hubo un error')
    return res.status(400).json({ message: error.message })
  }

  const { email } = req.body
  if (veterinary.email !== req.body.email) {
    const existingEmail = await Veterinary.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ message: 'El email indicado ya está en uso' })
    }
  }

  try {
    
    veterinary.name = req.body.name
    veterinary.email = req.body.email
    veterinary.web = req.body.web
    veterinary.telephone = req.body.telephone

    const updatedVeterinary = await veterinary.save()

    res.json(updatedVeterinary)

  } catch (error) {
    console.log(error)
  }

}

const confirmAccount = async (req, res) => {
  
  const { token } = req.params
  const user = await Veterinary.findOne({ token })
  
  if (!user) {
    const error = new Error('Enlace inválido')
    return res.status(404).json({ message: error.message })
  }

  try {

    user.token = null
    user.confirmed = true
    await user.save()
    
    res.json({ message: 'Usuario confirmado correctamente'})

  } catch (error) {
    console.log(error)
  }

}

const login = async (req, res) => {
  
  const { email, password } = req.body
  const user = await Veterinary.findOne({ email })
  if (!user) {
    const error = new Error('El usuario indicado no existe')
    return res.status(403).json({ message: error.message })
  }

  if (!user.confirmed) {
    const error = new Error('Tu cuenta no ha sido confirmada. Por favor revisa tu email.')
    return res.status(403).json({ message: error.message })
  }

  if (await user.checkPassword(password)) {
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwtGenerate(user.id)
    })

  } else {
    const error = new Error('Usuario o contraseña incorrecto.')
    return res.status(403).json({ message: error.message })
  }
  
}

const resetPassword = async (req, res) => {

  const { email } = req.body
  const veterinary = await Veterinary.findOne({ email })
  
  if (!veterinary) {
    const error = new Error('El usuario no existe')
    return res.status(400).json({ message: error.message })
  }

  try {
    
    veterinary.token = generateToken()
    await veterinary.save()

    forgotPasswordEmail({
      name: veterinary.name,
      email,
      token: veterinary.token
    })

    res.json({ message: 'Te hemos enviado un email con las instrucciones.'})

  } catch (error) {
    console.log(error)
  }

}

const checkToken = async (req, res) => {

  const { token } = req.params
  
  const isTokenValid = await Veterinary.findOne({ token })
  if (isTokenValid) {
    
    res.json({ message: 'Token válido' })

  } else {
    const error = new Error('Token inválido')
    return res.status(400).json({ message: error.message })
  }

}

const changePassword = async (req, res) => {

  const { token } = req.params
  const { password } = req.body

  const veterinary = await Veterinary.findOne({ token })
  if (!veterinary) {
    const error = new Error('Ocurrió un error.')
    return res.status(400).json({ message: error.message })
  }

  try {
    
    veterinary.token = null
    veterinary.password = password
    await veterinary.save()

    res.json({ message: 'Contraseña actualizada correctamente' })

  } catch (error) {
    console.log(error)
  }

}

const updatePassword = async (req, res) => {
  
  const { id } = req.veterinary
  const { currentPassword, newPassword } = req.body
  
  const veterinary = await Veterinary.findById(id)
  if (!veterinary) {
    const error = new Error('Ocurrió un error.')
    return res.status(400).json({ message: error.message })
  }

  if (await veterinary.checkPassword(currentPassword)) {
    
    veterinary.password = newPassword

    try {

      await veterinary.save()
      res.json({ message: 'Contraseña actualizada correctamente' })
      
    } catch (error) {
      console.log(error)
    }

  } else {
    const error = new Error('La contraseña actual ingresada es incorrecta.')
    return res.status(400).json({ message: error.message })
  }

}

export {
  register,
  profile,
  confirmAccount,
  login,
  resetPassword,
  checkToken, 
  changePassword,
  updateProfile,
  updatePassword
}