const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const zod = require('zod')

const jwt = require('jsonwebtoken');
const { User, Account } = require('../db');
const { JWT_SECRET } = require('../config');
const { authmiddleware } = require('../middleware');



//SignUp
const signupBody = zod.object({
    username : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string()
})


router.post("/signup",async(req,res)=>{
    const { success } = signupBody.safeParse(req.body)
    if (!success){
        return res.status(411).json({
            message : "Email already taken Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username : req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message : "Email already taken / Incoorect inputs"
        })
    }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 = salt rounds

        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });


    const userId = user._id;

    await Account.create({
        userId , 
        balance : 1 + Math.random()*10000
    })
    
    const token = jwt.sign({
        userId 
     },JWT_SECRET);

   res.json({
    message : "User created successfully" ,
    token : token
   })
})


// Signin
const signinBody = zod.object({
    username : zod.string().email(),
    password : zod.string()
})

router.post("/signin", async(req,res)=>{
    const {success} = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message : "  Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username : req.body.username ,
    });

    if (!user) {
    return res.status(411).json({
        message: "Error while logging in"
    });
}

   const passwordMatch = await bcrypt.compare(req.body.password, user.password);

            if (!passwordMatch) {
            return res.status(411).json({
                message: "Invalid credentials"
            });
        }

            const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token ,
             user: {
            firstName: user.firstName,
            lastName: user.lastName,
            },
        });

    // res.status(411).json({
    //     message : "Error while logging in"
    // })
})

//updating credentials 



const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put('/update', authmiddleware, async (req, res) => {
  const parsed = updateBody.safeParse(req.body);

  if (!parsed.success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  const updates = { ...parsed.data };

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  await User.updateOne(
    { _id: req.userId },
    { $set: updates }
  );

  res.json({
    message: "Updated successfully",
  });
});




//finding all the users having common phrase
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: { "$regex": filter }
        }, {
            lastName: { "$regex": filter }
        }]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});




module.exports = router;