import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import veterinaryRoutes from './routes/veterinaryRoutes.js'
import patientRoutes from './routes/patientRoutes.js'

const app = express()

app.use(express.json())

dotenv.config()

connectDB()

const allowedDomains = [process.env.CLIENT_URL]
const corsOptions = {
  origin: function(origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

app.use('/api/veterinarios', veterinaryRoutes)
app.use('/api/pacientes', patientRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})

