const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    const token = req.headers.authorization;

    // token check
    if (!token) {
      return res.status(401).json({
        message: "No Token Found",
      });
    }

    // verify token
    const verified = jwt.verify(
      token,
      "mySecretKey"
    );

    req.user = verified;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid Token",
    });

  }

};

module.exports = authMiddleware;