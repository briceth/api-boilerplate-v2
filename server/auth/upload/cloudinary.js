const uniqid = require('uniqid')

exports.avatarConfig = {
  folder: 'avatar',
  public_id: uniqid(),
  allowedFormats: ['jpg', 'png'],
  transformation: [
    {
      width: 200,
      height: 200,
      crop: 'thumb',
      gravity: 'face'
    }
  ]
}

exports.diaryConfig = {
  folder: 'diary',
  public_id: uniqid(),
  allowedFormats: ['jpg', 'png'],
  transformation: [
    {
      width: 400,
      height: 600,
      crop: 'thumb'
    }
  ]
}

exports.curriculumConfig = {
  folder: 'curriculum',
  public_id: uniqid(),
  resource_type: 'raw'
}
exports.logoConfig = {
  folder: 'logo',
  public_id: uniqid(),
  allowedFormats: ['jpg', 'png']
}

exports.defaultConfig = {
  folder: 'other',
  public_id: uniqid(),
  allowedFormats: ['jpg', 'png']
}
