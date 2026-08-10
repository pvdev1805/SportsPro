// GET /register-product
export const renderRegistrationPage = (req, res) => {
  return res.render('pages/register-product', {
    title: 'Register Product'
  })
}
