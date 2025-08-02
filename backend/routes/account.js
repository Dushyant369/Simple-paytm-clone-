const express = require('express');
const { authmiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const z = require('zod')


router.get('/balance',authmiddleware , async(req,res)=>{

   const account = await Account.findOne({
    userId : req.userId 
   });

   res.json({
    balance : account.balance
   })
} );

//transfer money
const transferSchema = z.object({
  amount: z.number().positive(), // must be a positive number
  to: z.string().min(1)          // must be a non-empty string (userId of receiver)
});

router.post('/transfer', authmiddleware, async (req, res) => {
  // Zod validation
  const parsed = transferSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.errors
    });
  }

  const { amount, to } = parsed.data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch sender's account
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient Balance" });
    }

    // Fetch receiver's account
    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid Account" });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({ message: "Transfer successful" });

  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Something went wrong", error: err.message });
  } finally {
    session.endSession();
  }
});





module.exports = router;