const router = require('express').Router()

router.use('/applications', require('./application/routes'))
router.use('/classes', require('./class/routes'))
router.use('/companies', require('./company/routes'))
router.use('/messages', require('./message/routes'))
router.use('/offers', require('./offer/routes'))
router.use('/users', require('./user/routes'))

module.exports = router
