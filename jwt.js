const jwt = require("jsonwebtoken");
const secretKey="12345";

//jwt verify
const jwtAuthMiddleware = (req, res, next) => {

  //first check request headers has authorization or not
  const authorization=req.headers.authorization;
  if(!authorization) return res.status(401).json({error: "Token not found"})
    
  //Extract the jwt token from the request headers  
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json("Unauthorized");

  try {
    //verify the JWT token
    // const decoded = jwt.verify(token, process.env.Jwt_SECRET);
    const decoded = jwt.verify(token, secretKey);

    //attach user information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "Invalid Token" });
  }
};

//jwt generate
const generateToken = (userData) => {
//   return jwt.sign(userData, process.env.Jwt_SECRET);
return jwt.sign(userData, secretKey, { expiresIn: '30d' });
};

module.exports = { jwtAuthMiddleware, generateToken };
