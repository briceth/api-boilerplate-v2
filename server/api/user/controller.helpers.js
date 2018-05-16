const Candidature = require('../application/model')
const {
  ObjectId
} = require('mongoose').Types

exports.getApplications = async (students) => {
  const finalDoc = []

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    // le nombre de candidatures
    const number = await Candidature.find({
      student: new ObjectId(student._id)
    }).count()

    // les candidatures
    const application = await Candidature.find({
      student: new ObjectId(student._id)
    })

    finalDoc.push({
      account: student.account,
      _id: student._id,
      application: {
        statut: application[0].status,
        number
      }
    })
  }

  return finalDoc
}