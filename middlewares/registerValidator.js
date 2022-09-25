const Joi = require("joi");

const registerValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().trim(),
    email: Joi.string().email().required().trim(),
    username: Joi.string().min(3).max(20).required().trim(),
    password: Joi.string().min(6).max(100).required().trim(),
    password2: Joi.ref("password"),
  });
  return schema.validate(data);
};

module.exports = registerValidator;
