const { Router } = require('express')
const router = Router()

const { getUserByToken } = require('../controllers/_helpers')

router.use(getUserByToken)
router.use('/api', require('./api'))
router.use('/', require('./pages'))

module.exports = router
