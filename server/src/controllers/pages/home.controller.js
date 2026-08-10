// GET /
export const renderHomePage = (req, res) => {
  return res.render('pages/home', {
    title: 'Home'
  })
}
