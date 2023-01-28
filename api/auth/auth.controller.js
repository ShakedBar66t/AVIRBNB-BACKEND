const authService = require('./auth.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    const { email, password } = req.body
    console.log('this is req', email)
    try {
        const user = await authService.login(email, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken)

        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(403).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const { email, password, fullname } = req.body
        const imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
        // logger.debug(fullname + ', ' + email + ', ' + password)
        const account = await authService.signup(email, password, fullname, imgUrl)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(email, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken)

        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout
}