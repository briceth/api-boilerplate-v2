const Candidature = require('./model')
const User = require('../user/model')

//GET CONTROLLERS
exports.getApplicationsFromStudent = req => {
  const { id: student } = req.params
  return Candidature.find({ student }).count()
}

//POST CONTROLLERS
exports.create = async (req, res, next) => {
  const { offer, student, motivation_letter } = req.body

  try {
    await User.findByIdAndUpdate(
      student,
      { 'account.motivation_lette': motivation_letter },
      { new: true }
    )
  } catch (error) {
    return next(
      "Une erreur est survenue lors de l'enregistrement de votre lettre de motivation"
    )
  }

  Candidature.create({ offer, student })
    .then(() => {
      return res
        .status(201)
        .json({ message: 'Votre candidature a été envoyée !' })
    })
    .catch(error => next(error))
}

//PUT CONTROLLERS
exports.update = (req, res, next) => {
  const { body, id } = req

  return Candidature.findOneAndUpdate(id, body, {
    new: true
  })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//DELETE CONTROLLERS
exports.delete = (req, res, next) => {
  const { id } = req.body

  return Candidature.findOneAndRemove(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
