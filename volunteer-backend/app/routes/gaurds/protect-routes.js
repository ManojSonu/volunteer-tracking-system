const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = (req, res, next) => {
  let token = req.headers['authorization'] || req.params.token;
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          errors: {
            message: 'Not Authorized!'
          }
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(400).json({
      errors: {
        message: 'Not authorized!'
      }
    })
  }
};