import { Country } from '../models/index.js'

const getAllCountries = async () => {
  const countries = await Country.findAll({
    order: [['countryName', 'ASC']]
  })

  return countries
}

const countryService = {
  getAllCountries
}

export default countryService
