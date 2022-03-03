import nodemailer from 'nodemailer'

const forgotPasswordEmail = async (data) => {

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  })

  const { name, email, token } = data

  const info = await transporter.sendMail({
    from: 'APV - Administrador de Pacientes de Veterinaria',
    to: email,
    subject: 'Restablece tu Contraseña',
    text: 'Restablece tu Contraseña',
    html: `
      <p>Hola ${name}! Solicitaste restablecer tu contraseña.</p>
      <p>
        Sigue el siguiente enlace para crear una nueva contraseña: 
        <a href="${process.env.CLIENT_URL}/recuperar-contrasena/${token}">Restablecer contraseña</a>
      </p>

      <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
    `
  })

  console.log('Email de recuperación enviado: %s', info.messageId)

}

export default forgotPasswordEmail
