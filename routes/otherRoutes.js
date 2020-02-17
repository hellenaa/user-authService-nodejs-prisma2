const router = require('express').Router();
const { getHomeProducts, test } = require('../controllers/homeController');
const { authUser } = require('../auth');

router.get('/', authUser, getHomeProducts);
router.post('/', authUser, test);

module.exports = router;