import { validationResult } from "express-validator";

// Runs after express-validator chains and returns the first error message
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

export default validate;
