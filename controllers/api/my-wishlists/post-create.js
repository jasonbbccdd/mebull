const { body } = require('express-validator')

const { authenticateCurrentUserByToken, checkValidation, MulterParser } = require('../../_helpers')
const { Wishlist } = require('../../../models')

const permittedParams = [
  'title',
  'description',
  'WishlistItem.name',
  'WishlistItem.importance',
  'WishlistItem.received',
  ''
]

const validation = [
  body('title').isString().withMessage('Title must be a String').notEmpty().withMessage('Title is Required'),
  body('description').isString().withMessage('Description must be a String').notEmpty().withMessage('Description is Required'),
  body('WishlistItems').isArray({ min: 1}).withMessage('Wishlist must have at least 1 Item'),
  body('WishlistItems.*.name').isString().withMessage('Item Name must be a String').notEmpty().withMessage('Item Name is Required'),
  body('WishlistItems.*.importance').toInt().isInt({ min: 0, max: 5 }).withMessage('Item Important must be Between 0 and 5'),
  body('WishlistItems.*.received').default(false).toBoolean().isBoolean().withMessage('Item Received must be a Checked or Un-Checked')
]

const apiMyWishlistsCreate = async function(req, res) {
  const { locals: { currentUser } } = res
  const { body: wishlistParams } = req
  const newWishlist = await Wishlist.create({
    ...wishlistParams,
  }, {
    fields: permittedParams,
    include: {
      association: Wishlist.WishlistItems
    }
  })
  newWishlist.setUser(currentUser)

  res.status(200).json(newWishlist)
}

module.exports = [authenticateCurrentUserByToken('json'), MulterParser.none(), validation, checkValidation, apiMyWishlistsCreate]
