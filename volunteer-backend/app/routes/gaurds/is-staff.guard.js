const jwt = require('jsonwebtoken');
const config = require('../../config');

const sendErrors = (res, message = 'Not authorized') => {
  return res.status(400).json({
    errors: {
      message
    }
  })
};

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return sendErrors(res, 'Invalid token!');
      } else if (decoded.user.type !== 'staff') {
        return sendErrors(res);
      } else {
        req.decoded = decoded;
        req.body.params = req.params;
        next();
      }
    });
  } else {
    return sendErrors(res);
  }
};