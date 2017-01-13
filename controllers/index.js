var router = require('express').Router();

router.use('/admin', require('./adminController'));
router.use('/', require('./guestController'));

module.exports = router;
