const { Router } = require('express')
const router = Router()

router.get('/', require('../controllers/pages/static/get-home'))                            // ROOT   GET /

router.get('/auth/signup', require('../controllers/pages/auth/get-signup'))                 // SIGNUP GET /signup
router.get('/auth/login', require('../controllers/pages/auth/get-login'))                   // LOGIN  GET /login

router.get('/wishlists/', require('../controllers/pages/wishlists/get-index'))              // INDEX  GET /wishlists
router.get('/wishlists/:id', require('../controllers/pages/wishlists/get-show'))            // SHOW   GET /wishlists/:id

router.get('/my/wishlists/', require('../controllers/pages/my-wishlists/get-index'))        // INDEX  GET /my/wishlists
router.get('/my/wishlists/new', require('../controllers/pages/my-wishlists/get-new'))       // NEW    GET /my/wishlists/new
router.get('/my/wishlists/:id', require('../controllers/pages/my-wishlists/get-show'))      // SHOW   GET /my/wishlists/:id
router.get('/my/wishlists/:id/edit', require('../controllers/pages/my-wishlists/get-edit')) // EDIT   GET /my/wishlists/:id/edit

router.get('/my/profile', require('../controllers/pages/my-profile/get-show'))           // SHOW   GET /my/profile

// Error Response
router.use(function (req, res) {
  res.render('not-found', { message: "Sorry! Page does not exist!" })
})

module.exports = router
