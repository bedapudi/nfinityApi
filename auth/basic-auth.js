module.exports = basicAuth;
const userController = require('../controllers/userController')

async function basicAuth(req, res, next) {
    if (req.path === '/login') {
        return next();
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    userController.login(username, password).then(user => {
        // attach user to request object
        req.user = user
        next();
    }).catch(error => {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    });
    
}