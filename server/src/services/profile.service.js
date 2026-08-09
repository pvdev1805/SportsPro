import { Administrator, Country, Customer, Technician, User } from '../models/index.js'
import { NotFoundError } from '../utils/app-error.js'
import { USER_ROLES } from '../constants/user-roles.js'

const toPublicProfile = (user) => {
  const baseProfile = {
    userId: user.userId,
    email: user.email,
    role: user.role,
    isActive: user.isActive
  }

  switch (user.role) {
    case USER_ROLES.ADMIN:
      return {
        ...baseProfile,
        profile: user.administrator
          ? {
              username: user.administrator.username
            }
          : null
      }

    case USER_ROLES.TECHNICIAN:
      return {
        ...baseProfile,
        profile: user.technician
          ? {
              techId: user.technician.techId,
              firstName: user.technician.firstName,
              lastName: user.technician.lastName,
              phone: user.technician.phone
            }
          : null
      }

    case USER_ROLES.CUSTOMER:
      return {
        ...baseProfile,
        profile: user.customer
          ? {
              customerId: user.customer.customerId,
              firstName: user.customer.firstName,
              lastName: user.customer.lastName,
              address: user.customer.address,
              city: user.customer.city,
              state: user.customer.state,
              postalCode: user.customer.postalCode,
              countryCode: user.customer.countryCode,
              country: user.customer.country
                ? {
                    countryCode: user.customer.country.countryCode,
                    countryName: user.customer.country.countryName
                  }
                : null,
              phone: user.customer.phone
            }
          : null
      }

    default:
      return baseProfile
  }
}

const getProfileByUserId = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Administrator,
        as: 'administrator'
      },
      {
        model: Technician,
        as: 'technician'
      },
      {
        model: Customer,
        as: 'customer',
        include: {
          model: Country,
          as: 'country'
        }
      }
    ]
  })

  if (!user) {
    throw new NotFoundError(`User with ID "${userId}" not found`)
  }

  return toPublicProfile(user)
}

const profileService = {
  getProfileByUserId
}

export default profileService
