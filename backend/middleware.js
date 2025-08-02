const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');



const authmiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({ message: 'Authorization token missing or malformed'})
    }
    
    const token = authHeader.split(' ')[1];

      try{
        const decoded = jwt.verify(token,JWT_SECRET);
         // Check if token contains a userId
        if(decoded.userId){
        req.userId = decoded.userId; // attach to request
            next();}  
            else {
            return res.status(403).json({ message: 'Invalid token payload' });
        }   
      }
      catch(err){
        return res.status(403).json({message: 'Invalid or expired token'});
      }
};

module.exports = {
    authmiddleware
}