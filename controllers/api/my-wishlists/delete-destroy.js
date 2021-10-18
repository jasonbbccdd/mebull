const { authenticateCurrentUserByToken , myWishlist: { getCurrentUserWishlistById } } = require('../../_helpers')
const { WishlistItem } = require('../../../models')

const apiMyWishlistsDestroy = async function(req, res) {
  const { locals: { currentWishlist } } = res
  await currentWishlist.setWishlistItems([])
  await currentWishlist.destroy()
  await WishlistItem.destroy({ where: { WishlistId: null } })
  res.status(204).json()
}

module.exports = [authenticateCurrentUserByToken('json'), getCurrentUserWishlistById('json'), apiMyWishlistsDestroy]
