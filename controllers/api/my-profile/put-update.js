const { body } = require('express-validator')

const { authenticateCurrentUserByToken, checkValidation, MulterParser } = require('../../_helpers')

const permittedParams = [
  'firstName',
  'lastName'
]

const validation = [
  body('firstName').isString().withMessage('First Name must be a String').notEmpty().withMessage('First Name is Required'),
  body('lastName').isString().withMessage('Last Name must be a String').notEmpty().withMessage('Last name is Required'),
]

const userSerializer = function(values) {
  const { ...user } = values.dataValues
  delete user.passwordHash
  return user
}

const apiMyProfileUpdate = async function(req, res) {
  const { locals: { currentUser } } = res
  const { body: userParams } = req

  if (req.file && req.file.location) {
    await currentUser.update({ avatar: req.file.location }, { fields: ['avatar'] })
  }
  await currentUser.update(userParams, { fields: permittedParams })

  res.status(200).json(userSerializer(currentUser))
}

module.exports = [authenticateCurrentUserByToken('json'), MulterParser.single('avatar'), validation, checkValidation, apiMyProfileUpdate]
