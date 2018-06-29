const Offer = require('./model')
const User = require('../user/model')

//GET CONTROLLEURS
exports.getAll = (_, res, next) => {
  return Offer.find({})
    .populate('company')
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.getOne = (req, res, next) => {
  const { id } = req.params

  return Offer.findById(id)
    .populate({ path: 'company', select: 'name' })
    .select('title description loc')
    .then(offer => res.status(201).json(offer))
    .catch(error => next(error))
}

// - 1 trouve la lng et lat du student
// - 2 trouve les offres en fonction
// - 3 si le student a des offres favorites, on les place en premier dans l'array final
// TODO: add rayon 10 km
exports.getAllByLoc = async (req, res, next) => {
  const { id: studentId } = req.params
  let student

  try {
    student = await User.findById(studentId).select(
      'account.loc account.favorite_offers'
    )
  } catch (error) {
    return next('Une erreur est survenue avec cet utilisateur')
  }
  const [lat, lng] = student.account.loc

  const { favorite_offers } = student.account

  return Offer.find({
    loc: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lat, lng] }
      }
    }
  })
    .populate('company')
    .select('-company.industry')
    .then(offers => {
      const favoritesArray = []

      for (let i = 0; i < favorite_offers.length; i++) {
        const favoriteOffer = favorite_offers[i]

        for (let j = 0; j < offers.length; j++) {
          const offer = offers[j]

          if (favoriteOffer.equals(offer._id)) {
            favoritesArray.push(offer)
            const i = offers.indexOf(offer)
            offers.splice(i, 1)
          }
        }
      }

      return res.status(201).json([...favoritesArray, ...offers])
    })
    .catch(() => next("Aucune offre n'a été trouvée, revenez plus tard"))
}

//POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return Offer.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//PUT CONTROLLERS
exports.toggleActive = (req, res, next) => {
  const { id } = req
  const { is_active } = req.body

  return Offer.findOneAndUpdate(id, { is_active }, { new: true })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//DELETE CONTROLLERS
exports.delete = (req, res, next) => {
  const { id } = req.body

  return Offer.findOneAndRemove(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
