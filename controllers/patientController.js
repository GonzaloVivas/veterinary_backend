import Patient from "../models/Patient.js"

const savePatient = async (req, res) => {
  
  const patient = new Patient(req.body)
  patient.veterinary = req.veterinary._id
  try {
    
    const newPatient = await patient.save()
    res.json(newPatient)

  } catch (error) {
    console.log(error)
  }

}

const getPatients = async (req, res) => {
  const patients = await Patient.find().where('veterinary').equals(req.veterinary._id)
  res.json(patients)
}

const getPatient = async (req, res) => {

  const id = req.params.id
  const patient = await Patient.findById(id)
  if (!patient) {
    res.status(404).json({ message: 'Paciente no encontrado' })
  }

  if (patient.veterinary._id.toString() !== req.veterinary._id.toString()) {
    return res.json({ message: 'Acción no válida.' })
  }
  
  res.json(patient)

}

const updatePatient = async (req, res) => {

  const id = req.params.id
  const patient = await Patient.findById(id)
  if (!patient) {
    res.status(404).json({ message: 'Paciente no encontrado' })
  }

  if (patient.veterinary._id.toString !== req.veterinary._id.toString) {
    return res.json({ message: 'Acción no válida.' })
  }

  patient.name = req.body.name || patient.name
  patient.owner = req.body.owner || patient.owner
  patient.email = req.body.email || patient.email
  patient.date = req.body.date || patient.date
  patient.symptoms = req.body.symptoms || patient.symptoms

  try {
    const updatedPatient = await patient.save()
    res.json(updatedPatient)
  } catch (error) {
    console.log(error)
  }

}

const deletePatient = async (req, res) => {

  const id = req.params.id
  const patient = await Patient.findById(id)
  if (!patient) {
    res.status(404).json({ message: 'Paciente no encontrado' })
  }

  if (patient.veterinary._id.toString() !== req.veterinary._id.toString()) {
    return res.json({ message: 'Acción no válida.' })
  }

  try {
    await patient.deleteOne()
    res.json({ message: 'Paciente eliminado exitosamente.' })
  } catch (error) {
    console.log(error)
  }

}

export {
  savePatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient
}