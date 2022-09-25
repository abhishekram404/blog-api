const Joi = require("joi");

const updateValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().trim(),
    email: Joi.string().email().required().trim(),
    username: Joi.string().min(3).max(20).required().trim(),
    bio: Joi.string().max(300).allow(null, "").trim(),
    address: Joi.string().allow(null, "").trim(),
    dob: Joi.string().allow(null, "").trim(),
  });
  return schema.validate(data);
};

module.exports = updateValidator;
