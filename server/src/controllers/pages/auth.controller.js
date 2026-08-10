// GET /login
const renderLoginPage = (req, res) => {
  return res.render('pages/login', {
    title: 'Sign In'
  })
}

const authController = {
  renderLoginPage
}

export default authController
