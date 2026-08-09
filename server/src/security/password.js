import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

export const hashPassword = async (plainPassword) => {
  const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS)

  return hashedPassword
}

export const verifyPassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword)

  return isMatch
}
