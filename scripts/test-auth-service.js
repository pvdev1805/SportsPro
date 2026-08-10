import 'dotenv/config'

import sequelize from '../server/src/config/database.js'
import { RefreshToken, User } from '../server/src/models/index.js'
import authService from '../server/src/services/auth.service.js'

const TEST_EMAIL = 'auth.test@example.com'
const TEST_PASSWORD = 'Password123!'

const run = async () => {
  try {
    console.log('Connecting to database...')
    await sequelize.authenticate()
    console.log('Database connected.\n')

    // Cleanup from previous test runs
    const existingUser = await User.scope('withPasswordHash').findOne({
      where: {
        email: TEST_EMAIL
      }
    })

    if (existingUser) {
      await RefreshToken.destroy({
        where: {
          userId: existingUser.userId
        }
      })

      const customer = await existingUser.getCustomer()

      if (customer) {
        await customer.destroy()
      }

      await existingUser.destroy()
    }

    console.log('1. Register customer')

    const registrationResult = await authService.registerCustomer({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      firstName: 'Auth',
      lastName: 'Tester',
      address: '123 Test Street',
      city: 'Toowoomba',
      state: 'QLD',
      postalCode: '4350',
      countryCode: 'AU',
      phone: '0412345678'
    })

    console.log('Registration successful')
    console.log({
      user: registrationResult.user,
      accessTokenExists: Boolean(registrationResult.accessToken),
      refreshTokenExists: Boolean(registrationResult.refreshToken)
    })

    console.log('\n2. Login with correct password')

    const loginResult = await authService.login({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    })

    console.log('Login successful')
    console.log({
      user: loginResult.user,
      accessTokenExists: Boolean(loginResult.accessToken),
      refreshTokenExists: Boolean(loginResult.refreshToken)
    })

    console.log('\n3. Login with incorrect password')

    try {
      await authService.login({
        email: TEST_EMAIL,
        password: 'WrongPassword123!'
      })

      console.error('ERROR: Incorrect password was accepted')
    } catch (error) {
      console.log('Incorrect password correctly rejected:', error.message)
    }

    console.log('\n4. Check multiple sessions')

    const sessionsBeforeRefresh = await RefreshToken.findAll({
      where: {
        userId: loginResult.user.userId
      }
    })

    console.log(`Stored refresh-token sessions: ${sessionsBeforeRefresh.length}`)

    console.log('\n5. Refresh session')

    const refreshedResult = await authService.refreshSession(loginResult.refreshToken)

    console.log('Refresh successful')
    console.log({
      accessTokenExists: Boolean(refreshedResult.accessToken),
      refreshTokenExists: Boolean(refreshedResult.refreshToken),
      refreshTokenChanged: refreshedResult.refreshToken !== loginResult.refreshToken
    })

    console.log('\n6. Try reusing old refresh token')

    try {
      await authService.refreshSession(loginResult.refreshToken)

      console.error('ERROR: Revoked refresh token was accepted')
    } catch (error) {
      console.log('Old refresh token correctly rejected:', error.message)
    }

    console.log('\n7. Logout current session')

    await authService.logout(refreshedResult.refreshToken)

    console.log('Logout successful')

    console.log('\n8. Try refresh after logout')

    try {
      await authService.refreshSession(refreshedResult.refreshToken)

      console.error('ERROR: Logged-out refresh token was accepted')
    } catch (error) {
      console.log('Logged-out refresh token correctly rejected:', error.message)
    }

    console.log('\n9. Verify refresh token storage')

    const storedTokens = await RefreshToken.findAll({
      where: {
        userId: loginResult.user.userId
      },
      order: [['created_at', 'ASC']]
    })

    for (const token of storedTokens) {
      console.log({
        refreshTokenId: token.refreshTokenId,
        tokenHash: `${token.tokenHash.slice(0, 12)}...`,
        revokedAt: token.revokedAt,
        expiresAt: token.expiresAt
      })
    }

    console.log('\nAll authentication service tests completed.')
  } catch (error) {
    console.error('\nAuthentication service test failed:')
    console.error(error)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

run()
