const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const albumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

const songPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const validatePayload = (type, payload) => {
  let validationResult = '';
  if (type === 'album') {
    validationResult = albumPayloadSchema.validate(payload);
  } else {
    validationResult = songPayloadSchema.validate(payload);
  }

  if (validationResult.error) throw new InvariantError(validationResult.error.message);

  return validationResult;
};

module.exports = { validatePayload };
