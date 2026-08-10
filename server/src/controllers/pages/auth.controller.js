// GET /login
const renderLoginPage = (req, res) => {
  return res.render('pages/login', {
    title: 'Sign In'
  })
}

// GET /register
const renderRegisterPage = (req, res) => {
  return res.render('pages/register', {
    title: 'Create Account'
  })
}

const authController = {
  renderLoginPage,
  renderRegisterPage
}

export default authController
