const InvariantError = require('../exceptions/InvariantError');
const { albumPayloadSchema, songPayloadSchema } = require('./schema');

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
