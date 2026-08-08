import sequelize from '../config/database.js'
import { Technician, User } from '../models/index.js'
import { hashPassword } from '../security/password.js'
import { ConflictError, NotFoundError } from '../utils/app-error.js'

const technicianIncludes = [
  {
    model: User,
    as: 'user',
    attributes: ['userId', 'email', 'isActive']
  }
]

const getAllTechnicians = async () => {
  const technicians = await Technician.findAll({
    include: technicianIncludes,
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC']
    ]
  })

  return technicians
}

const getTechnicianById = async (techId, options = {}) => {
  const technician = await Technician.findByPk(techId, {
    include: technicianIncludes,
    ...options
  })

  if (!technician) {
    throw new NotFoundError(`Technician with ID "${techId}" not found`)
  }

  return technician
}

const createTechnician = async (technicianData) => {
  const email = technicianData.email.trim().toLowerCase()

  const existingUser = await User.findOne({
    where: {
      email
    }
  })

  if (existingUser) {
    throw new ConflictError(`User with email "${technicianData.email}" already exists`)
  }

  const hashedPassword = await hashPassword(technicianData.password)

  return sequelize.transaction(async (transaction) => {
    const user = await User.create(
      {
        email,
        passwordHash: hashedPassword,
        isActive: true
      },
      { transaction }
    )

    const technician = await Technician.create(
      {
        userId: user.userId,
        firstName: technicianData.firstName,
        lastName: technicianData.lastName,
        phone: technicianData.phone
      },
      { transaction }
    )

    return getTechnicianById(technician.techId, { transaction })
  })
}

const updateTechnician = async (techId, technicianData) => {
  return sequelize.transaction(async (transaction) => {
    const technician = await getTechnicianById(techId, { transaction })

    const updateData = {
      firstName: technicianData.firstName,
      lastName: technicianData.lastName,
      phone: technicianData.phone
    }

    await technician.update(updateData, { transaction })

    if (technicianData.email) {
      await technician.user.update(
        {
          email: technicianData.email
        },
        { transaction }
      )
    }

    return getTechnicianById(techId, { transaction })
  })
}

const deleteTechnician = async (techId) => {
  return sequelize.transaction(async (transaction) => {
    const technician = await getTechnicianById(techId, { transaction })

    await technician.user.update(
      {
        isActive: false
      },
      { transaction }
    )

    return getTechnicianById(techId, { transaction })
  })
}

const technicianService = {
  getAllTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician
}

export default technicianService
