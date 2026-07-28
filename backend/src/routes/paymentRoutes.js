const router = require('express').Router();
const controller = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');
const roles = require('../middleware/roleMiddleware');
router.get('/', auth, roles('ChuThue', 'NguoiThue'), controller.list);
router.post('/', auth, roles('ChuThue'), controller.create);
router.patch('/:id/paid', auth, roles('ChuThue'), controller.markPaid);
module.exports = router;
