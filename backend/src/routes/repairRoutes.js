const router = require('express').Router();
const controller = require('../controllers/repairController');
const auth = require('../middleware/authMiddleware');
const roles = require('../middleware/roleMiddleware');
router.get('/', auth, roles('ChuThue', 'NguoiThue'), controller.list);
router.post('/', auth, roles('NguoiThue'), controller.create);
router.patch('/:id/status', auth, roles('ChuThue'), controller.updateStatus);
module.exports = router;
