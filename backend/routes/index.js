const express = require('express');
const router = express.Router();
const userRouter = require('./user')
const accountRouter = require('./account')


router.use('/user',userRouter);
router.use('/account',accountRouter)








module.exports = router;
// /api/user /signup
// /api/user /signin
// /api/user /changePass


// /api/v1/account/transaction
// /api/v1/account/balance