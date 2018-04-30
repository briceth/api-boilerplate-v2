const router = require('express').Router()

router.use('/users', require('./user/routes'))
router.use('/offers', require('./offer/routes'))
router.use('/classes', require('./class/routes'))

module.exports = router
