import Technician from '../models/technician.model.js'
import { ConflictError, NotFoundError } from '../utils/app-error.js'

const getAllTechnicians = async () => {
  const technicians = await Technician.findAll({
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC']
    ]
  })

  return technicians
}

const getTechnicianById = async (techId) => {
  const technician = await Technician.findByPk(techId)

  if (!technician) {
    throw new NotFoundError(`Technician with ID "${techId}" not found`)
  }

  return technician
}

const createTechnician = async (technicianData) => {
  const existingTechnician = await Technician.findOne({
    where: {
      email: technicianData.email
    }
  })

  if (existingTechnician) {
    throw new ConflictError(`Technician with email "${technicianData.email}" already exists`)
  }

  const { firstName, lastName, email, phone, password } = technicianData

  const technician = await Technician.create({ firstName, lastName, email, phone, password })

  return technician
}

const updateTechnician = async (techId, technicianData) => {
  const technician = await getTechnicianById(techId)

  const updateData = {
    firstName: technicianData.firstName,
    lastName: technicianData.lastName,
    email: technicianData.email,
    phone: technicianData.phone,
    password: technicianData.password
  }

  await technician.update(updateData)

  return technician
}

const deleteTechnician = async (techId) => {
  const technician = await getTechnicianById(techId)

  await technician.destroy()
}

const technicianService = {
  getAllTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician
}

export default technicianService
