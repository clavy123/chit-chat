const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, 'ABCDE', {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
