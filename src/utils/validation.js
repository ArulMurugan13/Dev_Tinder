const validator = require("validator");

const validateSignUpData = (req) => {
  const { fname, lname, email, password } = req.body;
  if (!fname || !lname || fname.lenght < 3) {
    throw new Error("The Name is invalid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Eroor("Password is weak, Enter Strong Password");
  }

  console.log("All validation done");
};

module.exports = validateSignUpData;
