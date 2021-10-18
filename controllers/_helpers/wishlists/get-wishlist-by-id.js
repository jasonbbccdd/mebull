const { Wishlist } = require('../../../models')

module.exports = async function (req, res, next) {
  const { params: { id } } = req
  const wishlist = await Wishlist.findOne({
    where: { id: Number(id) || 0 },
    include: [
      {
        association: Wishlist.WishlistItems
      }, {
        association: Wishlist.User
      }
    ],
    order: [['WishlistItems', 'createdAt', 'DESC']]
  })
  if (!wishlist) return res.status(404).render('pages/not-found', { message: `Wishlist with ID: ${id} is not found` })

  res.locals.currentWishlist = wishlist

  next()
}
