const logger = require('../services/logger.service')
const authService = require('../api/auth/auth.service')
const config = require('../config')

async function requireAuth(req, res, next) {
  console.log(req.body, 'from middleware')
  if (config.isGuestMode && !req?.cookies?.loginToken) {
    req.loggedinUser = { _id: '', fullname: 'Guest' }
    return next()
  }

  if (!req?.cookies?.loginToken) return res.status(403).send('Not Authenticated1')
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(403).send('Not Authenticated2')

  req.loggedinUser = loggedinUser
  next()
}

async function requireAdmin(req, res, next) {
  if (!req?.cookies?.loginToken) return res.status(403).send('Not Authenticated3')
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser.isAdmin) {
    logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
    res.status(403).end('Not Authorized')
    return
  }
  next()
}
// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin
}
