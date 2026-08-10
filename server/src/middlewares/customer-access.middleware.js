import { USER_ROLES } from '../constants/user-roles.js'
import { Customer } from '../models/index.js'
import { BadRequestError, ForbiddenError } from '../utils/app-error.js'

const authorizeCustomerAccess = async (req, res, next) => {
  try {
    if (req.user.role === USER_ROLES.ADMIN) {
      return next()
    }

    const customerId = req.validated?.params?.customerId ?? Number(req.params.customerId)

    if (!Number.isInteger(customerId) || customerId <= 0) {
      throw new BadRequestError('Invalid customer ID')
    }

    const customer = await Customer.findOne({
      where: {
        customerId,
        userId: req.user.userId
      }
    })

    if (!customer) {
      throw new ForbiddenError('You do not have permission to access this customer')
    }

    return next()
  } catch (error) {
    next(error)
  }
}

export default authorizeCustomerAccess
