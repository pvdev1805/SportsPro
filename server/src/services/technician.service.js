import sequelize from '../config/database.js'
import { USER_ROLES } from '../constants/user-roles.js'
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
  return Technician.findAll({
    include: technicianIncludes,
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC']
    ]
  })
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
  const { firstName, lastName, email, phone, password } = technicianData

  const existingUser = await User.findOne({
    where: {
      email
    }
  })

  if (existingUser) {
    throw new ConflictError(`User with email "${email}" already exists`)
  }

  const passwordHash = await hashPassword(password)

  return sequelize.transaction(async (transaction) => {
    const user = await User.create(
      {
        email,
        passwordHash,
        role: USER_ROLES.TECHNICIAN,
        isActive: true
      },
      {
        transaction
      }
    )

    const technician = await Technician.create(
      {
        userId: user.userId,
        firstName,
        lastName,
        phone
      },
      {
        transaction
      }
    )

    return getTechnicianById(technician.techId, { transaction })
  })
}

const updateTechnician = async (techId, technicianData) => {
  return sequelize.transaction(async (transaction) => {
    const technician = await getTechnicianById(techId, { transaction })

    const technicianUpdateData = {}

    if (technicianData.firstName !== undefined) {
      technicianUpdateData.firstName = technicianData.firstName
    }

    if (technicianData.lastName !== undefined) {
      technicianUpdateData.lastName = technicianData.lastName
    }

    if (technicianData.phone !== undefined) {
      technicianUpdateData.phone = technicianData.phone
    }

    if (Object.keys(technicianUpdateData).length > 0) {
      await technician.update(technicianUpdateData, { transaction })
    }

    if (technicianData.email !== undefined) {
      const existingUser = await User.findOne({
        where: {
          email: technicianData.email
        },
        transaction
      })

      if (existingUser && existingUser.userId !== technician.userId) {
        throw new ConflictError(`User with email "${technicianData.email}" already exists`)
      }

      await technician.user.update(
        {
          email: technicianData.email
        },
        {
          transaction
        }
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
      {
        transaction
      }
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
