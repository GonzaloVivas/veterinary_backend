import nodemailer from 'nodemailer'

const registerEmail = async (data) => {

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
    subject: 'Comprueba tu cuenta en APV',
    text: 'Comprueba tu cuenta en APV',
    html: `
      <p>Hola ${name}! Bienvenido a APV.</p>
      <p>
        Tu cuenta está lista. Por favor haz click en el siguiente enlace para comprobarla.
        <a href="${process.env.CLIENT_URL}/confirmar/${token}">Comprobar cuenta</a>
      </p>

      <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
    `
  })

  console.log('Email de registro enviado: %s', info.messageId)

}

export default registerEmail
