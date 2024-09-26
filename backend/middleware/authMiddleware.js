import jwt from "jsonwebtoken";
import userController from "../controllers/userController.js";



const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("This is auth header:")
    console.log(authHeader)
    if (authHeader) {
      // const token = authHeader.split(" ")[1];
      const token = authHeader;
  
      console.log("this is the token")
      console.log(token)
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
        req.user = user;
        console.log(user)
        next();
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
  };

let refreshTokens = [];


const refreshAccessToken = (req, res) => {
    const { token: refreshToken } = req.body;
  
    if (!refreshToken) return res.status(401).json("You are not authenticated!");
  
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh Token is not valid!");
    }
  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json("Refresh token is not valid or expired!");
  
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  
      const newAccessToken = userController.generateAccessToken(user);
      const newRefreshToken = userController.generateRefreshToken(user);
  
      refreshTokens.push(newRefreshToken);
  
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  };
  

  export default{
    refreshAccessToken,
    verifyAccessToken
  }