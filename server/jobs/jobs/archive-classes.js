const Class = require('../../api/class/model')
const worker = require('debug')('yolo')

module.exports = agenda => {
  //TODO: date à définir
  agenda.define('archive classes', async (_, done) => {
    const classesIds = await Class.find({}).select('_id')

    var ids = {
      _id: { $in: classesIds }
    }

    try {
      Class.update(ids, { is_active: false }, { multi: true })
        .then(docs => {
          console.log('docs', docs)
          //worker('worker', docs)
        })
        .catch(error => console.log(error))
    } catch (error) {
      console.log('error', error)
    }
    done()
  })
}
