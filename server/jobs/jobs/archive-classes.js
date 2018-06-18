const Class = require('../../api/class/model')
//const worker = require('debug')('yolo')

module.exports = agenda => {
  agenda.define('archive classes', async (_, done) => {
    try {
      Class.update({}, { is_active: false }, { multi: true })
        .then(docs => {
          console.log('docs', docs)
        })
        .catch(error => console.log(error))
    } catch (error) {
      console.log('error', error)
    }
    done()
  })
}
