import profileService from '../../services/profile.service.js'

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user.userId)

    return res.status(200).json({
      success: true,
      data: profile
    })
  } catch (error) {
    next(error)
  }
}

const profileController = {
  getProfile
}

export default profileController
