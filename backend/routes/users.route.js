const router = require('express').Router();
const { userAuth, checkRole, userRegister, userLogin, serializeUser } = require('../utils/Auth');

// user Registration
router.post('/register-user', async (req, res) => {
    await userRegister(req.body, 'user', res);
});

// admin Registration
router.post('/register-admin', async (req, res) => {
    await userRegister(req.body, 'admin', res);
});

// super admin Registration
router.post('/register-super-admin', async (req, res) => {
    await userRegister(req.body, 'super-admin', res);
});

// user Login
router.post('/login-user', async (req, res) => {
    await userLogin(req.body, 'user', res);
});

// admin Login
router.post('/login-admin', async (req, res) => {
    await userLogin(req.body, 'admin', res);
});

// super admin Login
router.post('/register-super-admin', async (req, res) => {
    await userLogin(req.body, 'super-admin', res);
});

//profile Route
router.get('/profile', userAuth, async (req, res) => {
    return res.json(serializeUser(req.user));
});

//user protected route
router.get('/user-protected', userAuth, checkRole(['user']), async (req, res) => {
    return res.json('hello user');
});

//admin protected route
router.get('/admin-protected', userAuth, checkRole(['admin']), async (req, res) => {
    return res.json('hello admin');
});

//superAdmin protected route
router.get('/super-admin-protected', userAuth, checkRole(['super-admin']), async (req, res) => {
    return res.json('hello super admin');
});

//superAdmin and admin protected route
router.get('/super-admin-and-admin-protected', userAuth, checkRole(['super-admin', 'admin']), async (req, res) => {
    return res.json('hellp superAdmin n Admin');
});


module.exports = router;