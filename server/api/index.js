const router = require('express').Router()

router.use('/users', require('./user/routes'))
router.use('/offers', require('./offer/routes'))

module.exports = router
