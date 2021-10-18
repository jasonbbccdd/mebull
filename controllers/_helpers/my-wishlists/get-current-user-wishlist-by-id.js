const { Wishlist } = require('../../../models')

module.exports = function(format) {
  return async function (req, res, next) {
    const { locals: { currentUser } } = res
    const { params: { id } } = req
    const wishlist = await Wishlist.findOne({
      where: {
        id: Number(id) || 0,
        UserId: currentUser.id
      },
      include: [
        {
          association: Wishlist.WishlistItems
        }, {
          association: Wishlist.User
        }
      ],
      order: [['WishlistItems', 'createdAt', 'DESC']]
    })

    if (!wishlist) {
      if (format === 'html') {
        return res.status(404).render('pages/not-found', { message: `Wishlist with ID: ${id} is not found` })
      }

      if (format === 'json') {
        return res.status(404).json({ message: `Wishlist of ID ${id} not found!` })
      }
    }

    res.locals.currentWishlist = wishlist

    next()
  }
}
