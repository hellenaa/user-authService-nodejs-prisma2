const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { userSchema, loginSchema, validation } = require('../validation');

// //in case user will not get access token, and call this route with refresh token to get new tokens
// router.get('/token', (req, res)=>{
//     return res.json({token:"get token"});
// });
router.post('/register', userSchema, validation, register);
router.post('/login', loginSchema, validation, login);


module.exports = router;