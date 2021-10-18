const { body } = require('express-validator')

const { authenticateCurrentUserByToken, checkValidation, MulterParser, myWishlist: { getCurrentUserWishlistById } } = require('../../_helpers')
const { WishlistItem } = require('../../../models')

const permittedChangeParams = {
  Wishlist: ['title', 'description', 'WishlistItem.name', 'WishlistItem.importance', 'WishlistItem.received'],
  WishlistItems: ['name', 'importance', 'received']
}

const validation = [
  body('title').isString().withMessage('Title must be a String').notEmpty().withMessage('Title is Required'),
  body('description').isString().withMessage('Description must be a String').notEmpty().withMessage('Description is Required'),
  body('WishlistItems').isArray({ min: 1}).withMessage('Wishlist must have at least 1 Item'),
  body('WishlistItems.*.name').isString().withMessage('Item Name must be a String').notEmpty().withMessage('Item Name is Required'),
  body('WishlistItems.*.importance').toInt().isInt({ min: 0, max: 5 }).withMessage('Item Important must be Between 0 and 5'),
  body('WishlistItems.*.received').default(false).toBoolean().isBoolean().withMessage('Item Received must be a Checked or Un-Checked')
]

const apiMyWishlistsUpdate = async function(req, res) {
  const { body: { WishlistItems: itemsParams, ...wishlistParams } } = req
  const { locals: { currentWishlist } } = res

  await currentWishlist.update(wishlistParams, { fields: permittedChangeParams.Wishlist })
  await currentWishlist.setWishlistItems([])
  itemsParams.forEach(async function({ id: ItemId, ...itemParams }) {
    let wishlistItem = await WishlistItem.findOne({ where: { id: Number(ItemId) || 0 } })

    if (wishlistItem) {
      await wishlistItem.update(itemParams, { fields: permittedChangeParams.WishlistItems })
    } else {
      wishlistItem = await WishlistItem.create(itemParams, { fields: permittedChangeParams.WishlistItems })
    }

    await currentWishlist.addWishlistItem(wishlistItem)
  })
  await WishlistItem.destroy({ where: { WishlistId: null } })

  res.status(200).json(currentWishlist)
}

module.exports = [authenticateCurrentUserByToken('json'), MulterParser.none(), validation, checkValidation, getCurrentUserWishlistById('json'), apiMyWishlistsUpdate]
