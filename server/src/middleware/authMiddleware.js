{/**a middleware function sits in between the incoming request and your route handler
    it can either let the request continue or stop it early */}

const jwt = require('jsonwebtoken');

{/**next() - continue to the next middleware/route handler
    if you dont call next(), the request just stops there-
     perfect for rejecting unauthorized request */}
function requireAuth(req,res,next){
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: "No token provided"});
    }

    const token = authHeader.split(' ')[1];

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded { id, role } to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireAdmin(req,res,next){
    if(req.user.role !== 'admin'){
        return res.status(403).json({message: "Admin access required"});
    }
    next();
}

module.exports = {requireAuth, requireAdmin};